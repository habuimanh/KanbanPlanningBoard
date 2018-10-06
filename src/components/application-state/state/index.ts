import { OrderedList } from "../../utils"
import { WidgetConfigProperty } from "../../interface"

export interface IReferenceAssociation {
    ownerEntity: string,
    name: string,
}

export interface ICloneObject {
    guid: string,
    associations: Map<string, string[]>;
}

export class KanbanData {
    // Names of properties in mendix project
    private _propNames: WidgetConfigProperty;
    // Store all mendix object in an mapping: id => object
    private _idDictionary: Map<string | number, mendix.lib.MxObject>;
    // Store associations of all objects in an mapping: id => association[] => id[]
    private _associations: Map<string | number, Map<string, OrderedList>>;
    // Store entity type of all objects in an mapping: entity type => id[]
    private _entities: Map<string | number, Set<string>>;
    // Set of referent set association: association => association
    private _referenceSetAssociations: Set<string>;
    // Store all associations point to entity
    private _referenceAssociations: Map<string, IReferenceAssociation[]>;
    // Store copies of all objects (for removing)
    private _cloneObjects: Map<string | number, ICloneObject>;
    // Map entity to its order property 
    private _order: Map<string, string>;

    getPropNames = () => this._propNames;

    constructor(
        objects: mendix.lib.MxObject[] = [],
        propNames?: WidgetConfigProperty
    ) {
        this._idDictionary = new Map();
        this._associations = new Map();
        this._entities = new Map();
        this._referenceSetAssociations = new Set();
        this._referenceAssociations = new Map();
        this._cloneObjects = new Map();
        this._order = new Map();
        if (!propNames) {
            this._propNames = Object.create(Map);
            return;
        }
        try {
            this._propNames = propNames;
            this._propNames.createdDate = "createdDate";
            this._propNames.fileId = "FileID";
            this.setReferenceSetAssociations();
            this.setReferenceAssociations();
            this.setOrderProps();
            objects.forEach(object => this.addObject(object));
        } catch (e) {
            console.log(e);
        }
    }

    setOrderProps() {
        this._order.set(this._propNames.card, this._propNames.cardOrder);
        this._order.set(this._propNames.list, this._propNames.listOrder);
    }

    getOrderProp(entity: string): string {
        return this._order.get(entity) ? this._order.get(entity) as string : "";
    }

    getAllEntities() {
        return [
            this._propNames.account,
            this._propNames.list,
            this._propNames.board,
            this._propNames.card,
            this._propNames.comment,
            this._propNames.label,
            this._propNames.attachment,
            this._propNames.work,
            this._propNames.workList,
            this._propNames.document
        ]
    }

    isReferenceSetAssociation(associationName: string): boolean {
        return this._referenceSetAssociations.has(associationName.split("/")[0])
    }

    setReferenceAssociations() {
        let propNames = this._propNames;
        this._referenceAssociations.set(propNames.board, [{
            ownerEntity: propNames.list,
            name: propNames.listBoardAssociation,
        }]);
        this._referenceAssociations.set(propNames.list, [{
            ownerEntity: propNames.card,
            name: propNames.cardListAssociation
        }]);
        this._referenceAssociations.set(propNames.card, [{
            ownerEntity: propNames.comment,
            name: propNames.commentCardAssociation,
        }, {
            ownerEntity: propNames.attachment,
            name: propNames.attachmentCardAssociation,
        }, {
            ownerEntity: propNames.workList,
            name: propNames.workListCardAssociation
        }]);
        this._referenceAssociations.set(propNames.workList, [{
            ownerEntity: propNames.work,
            name: propNames.workWorkListAssociation
        }]);
        this._referenceAssociations.set(propNames.comment, [{
            ownerEntity: propNames.attachment,
            name: propNames.attachmentCommentAssociation
        }]);
        this._referenceAssociations.set(propNames.attachment, [{
            ownerEntity: propNames.document,
            name: propNames.documentAttachmentAssociation
        }])
    }

    isReferenceObject(sourceObject: mendix.lib.MxObject, desId: string): boolean {
        if (!this._associations.get(sourceObject.getGuid())) return false;
        let referenceAssociations = this.getReferenceAssociations(sourceObject);
        let result = false;
        let sourceGuid = sourceObject.getGuid();
        referenceAssociations.forEach(association => {
            let associationName = association.name.split("/")[0];
            if (this._associations.get(sourceGuid)!.get(associationName)
                && this._associations.get(sourceGuid)!.get(associationName)!.has(desId)) {
                result = true;
            }
        })
        return result;
    }

    setReferenceSetAssociations() {
        [
            this._propNames.subscriberCardAssociation,
            this._propNames.memberCardAssociation,
            this._propNames.boardMemberAssociation,
            this._propNames.tagAccountCommentAssociation,
            this._propNames.labelCardAssociation,
            this._propNames.accountAvatarAssociation,
        ].forEach(association => association && this._referenceSetAssociations.add(association.split("/")[0]));
    }

    getFormByEntity(entityName: string): string {
        switch (entityName) {
            case this._propNames.card: return this._propNames.cardEditForm;
            case this._propNames.list: return this._propNames.listEditForm;
            default: return "";
        }
    }

    compareIdByOrder(id1: string, id2: string): number {
        let order1 = this.getItemOrder(id1);
        let order2 = this.getItemOrder(id2);
        if (order1 > order2) return 1;
        if (order1 === order2) return 0;
        return -1;
    }

    compareObjectByOrder(object1: mendix.lib.MxObject, object2: mendix.lib.MxObject): number {
        let order1 = this.getItemOrder(object1);
        let order2 = this.getItemOrder(object2);
        if (order1 > order2) return 1;
        if (order1 === order2) return 0;
        return -1;
    }

    addClone(object: mendix.lib.MxObject) {
        let associations = new Map();
        let references: string[] = object["getReferenceAttributes"]();
        references.forEach(reference => associations.set(reference, object["getOriginalValue"](reference)));
        this._cloneObjects.set(object.getGuid(), {
            guid: object.getGuid(),
            associations: associations,
        })

    }

    addAssociation(sourceGuid: string, desGuid: string, association: string) {
        if (!this._associations.has(sourceGuid)) {
            this._associations.set(sourceGuid, new Map());
        }
        if (!this._associations.get(sourceGuid)!.has(association)) {
            this._associations.get(sourceGuid)!.set(association, new OrderedList([], undefined, this.compareIdByOrder.bind(this)));
        }
        this._associations.get(sourceGuid)!.get(association)!.insert(desGuid);
    }

    getReferenceAssociations(object: mendix.lib.MxObject): IReferenceAssociation[] {
        let result = this._referenceAssociations.get(object.getEntity());
        if (!result) return [];
        return result;
    }

    addAssociations(object: mendix.lib.MxObject) {
        let sourceGuid = object.getGuid();
        let associations: string[] = object["getReferenceAttributes"]();
        associations.forEach(association => {
            let desGuids = object["getOriginalValue"](association);
            if (desGuids && !(desGuids instanceof Array)) desGuids = [desGuids];
            desGuids && desGuids.forEach(desGuid => {
                this.addAssociation(desGuid.toString(), sourceGuid, association);
                if (this._referenceSetAssociations.has(association)) {
                    this.addAssociation(sourceGuid, desGuid.toString(), association);
                }
            })
        })
    }

    removeAssociation(sourceGuid: string | number, desGuid: string, association: string) {
        if (!this._associations.has(sourceGuid)) {
            return;
        }
        if (!this._associations.get(sourceGuid)!.has(association)) {
            return;
        }
        this._associations.get(sourceGuid)!.get(association)!.remove(desGuid);
    }

    removeAssociations(object: ICloneObject) {
        let associations = object.associations;
        associations.forEach((desGuids, association) => {
            if (desGuids && !(desGuids instanceof Array)) desGuids = [desGuids];
            desGuids && desGuids.forEach(desGuid => {
                this.removeAssociation(desGuid, object.guid, association);
                if (this._referenceSetAssociations.has(association)) {
                    this.removeAssociation(object.guid, desGuid.toString(), association);
                }
            })
        })
    }

    addEntities(object: mendix.lib.MxObject) {
        let entityName = object.getEntity();
        if (!this._entities.has(entityName)) {
            this._entities.set(entityName, new Set());
        }
        this._entities.get(entityName)!.add(object.getGuid());
    }

    removeEntities(object: mendix.lib.MxObject) {
        if (!this._entities.has(object.getEntity())) return;
        this._entities.get(object.getEntity())!.delete(object.getGuid());
    }

    addObject(object?: mendix.lib.MxObject) {
        if (!object) return;
        this.addClone(object);
        this._idDictionary.set(object.getGuid(), object);
        this.addEntities(object);
        this.addAssociations(object);
    }

    removeObject(object?: mendix.lib.MxObject | string) {
        if (!object) return
        if (typeof object === "string") {
            object = this._idDictionary.get(object);
        }
        let mxObject = object as mendix.lib.MxObject;
        this._idDictionary.delete(mxObject.getGuid());
        let cloneObject = this._cloneObjects.get(mxObject.getGuid());
        if (!cloneObject) return;
        this.removeEntities(mxObject);
        this.removeAssociations(cloneObject);
        this._cloneObjects.delete(mxObject.getGuid());
    }

    deleteReferenceAssociations(object: mendix.lib.MxObject) {
        this._associations.delete(object.getGuid());
        // let referenceAssociations = this.getReferenceAssociations(object)
        //     .map(association => association.name.split("/")[0]);
        // referenceAssociations.forEach(association =>
        //     this._associations.get(object.getGuid()) && this._associations.get(object.getGuid())!.delete(association));
    }

    updateObject(newObjects?: mendix.lib.MxObject | mendix.lib.MxObject[]) {
        if (!newObjects) return;
        if (!(newObjects instanceof Array)) {
            newObjects = [newObjects];
        }
        newObjects.forEach(newObject => {
            let guid = newObject.getGuid();
            let oldObject = this._idDictionary.get(guid);
            if (oldObject) {
                this.removeObject(oldObject);
            }
            this.addObject(newObject);
        })

    }

    getObjectIdsByAssociation(guid: string, association: string): string[] {
        if (!association) return [];
        association = association.split("/")[0];
        let allAssociations = this._associations.get(guid);
        if (!allAssociations || !allAssociations.has(association)) return [];
        return allAssociations.get(association)!.list;
    }

    getItemOrder(id: string | mendix.lib.MxObject): number {
        let item;
        if (typeof id === "string") {
            item = this._idDictionary.get(id);
        } else {
            item = id;
        }
        if (item && item.get(this.getOrderProp(item.getEntity()))) {
            return parseFloat(item.get(this.getOrderProp(item.getEntity()))["toPrecision"]());
        }
        return 1;
    }

    getObjectsByEntity(entityName: string): mendix.lib.MxObject[] {
        let ids = this._entities.get(entityName);
        if (!ids) return [];
        let result: mendix.lib.MxObject[] = [];
        ids.forEach(id => result.push(this._idDictionary.get(id) as mendix.lib.MxObject));
        return result;
    }

    getObjectsByAssociation(containerId: string, association: string): mendix.lib.MxObject[] {
        if (!containerId || !association) return [];
        let ids = this.getObjectIdsByAssociation(containerId, association);
        if (ids) {
            return ids.map(id => this._idDictionary.get(id) as mendix.lib.MxObject);
        } else {
            return [];
        }
    }

    calculateNewOrder(containerId: string, association: string, order?: number): number {
        if (order === undefined) {
            let ids = this.getObjectIdsByAssociation(containerId, association);
            return this.getItemOrder(ids[ids.length - 1]) + 1;
        }
        let destinationList = this.getObjectIdsByAssociation(containerId, association);
        if (!destinationList) return -1;
        if (order > destinationList.length) {
            order = destinationList.length;
        }
        if (order === 0) {
            return this.getItemOrder(destinationList[0]) - 1;
        } else if (order === destinationList.length) {
            return this.getItemOrder(destinationList[destinationList.length - 1]) + 1;
        } else {
            return parseFloat(((this.getItemOrder(destinationList[order - 1]) + this.getItemOrder(destinationList[order])) / 2).toFixed(8));
        }
    }

    calculateNewAssociation(containerId: string, association: string): { [id: string]: string } {
        let associations = {};
        associations[association.split("/")[0]] = containerId;
        return associations;
    }

    getObjectById(id: string): mendix.lib.MxObject | undefined {
        return this._idDictionary.get(id);
    }

    getAllObjects(): mendix.lib.MxObject[] {
        let objects: mendix.lib.MxObject[] = [];
        this._idDictionary.forEach(value => objects.push(value));
        return objects;
    }

    getAllObjectsId(): string[] {
        let ids: string[] = [];
        this._idDictionary.forEach((value, key) => value && ids.push(key.toString()))
        return ids;
    }
}

export interface AppState {
    data: KanbanData,
    unsubscribes: Set<number>,
    creatingIds: Map<string | number, string>
    pendingIds: Set<string>
}

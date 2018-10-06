export function openForm(path: string, object: mendix.lib.MxObject) {
    let context = new mendix.lib.MxContext;
    context.setTrackObject(object);
    context.setContext(object.getEntity(), object.getGuid())
    return new Promise((resolve, reject) => {
        if (!path) {
            resolve();
            return;
        }
        mx.ui.openForm(path, {
            location: "modal",
            callback: (form) => {
                resolve(form);
            },
            error: (e) => {
                console.log(e);
                reject(e)
            },
            context: context,
        })
    })
}
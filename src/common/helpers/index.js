export function cleanField(field) {
    return field.replace(/[^\w\s]/gi, '')
}

const codesPerOperation = {
    1: [1, 3, 5, 7, 9, 11, 13, 15], // 1-Read
    2: [2, 3, 6, 7, 10, 11, 14, 15], // 2-Insert
    4: [4, 5, 6, 7, 12, 13, 14, 15], // 4-Update
    8: [8, 9, 10, 11, 12, 13, 14, 15] // 8-Delete
}

function camelToSnake(text) {
    return text.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
}

export function can(reduxState, entity, scope, operation, id) {

    let entityName = camelToSnake(entity);

    const scopes = reduxState.auth.profile.scopes

    const list = reduxState[entityName].list && reduxState[entityName].list.length > 0
        ? reduxState[entityName].list
        : reduxState[entityName].list_update;

    // Percorra os objetos de escopo
    for (const key in scopes) {
        const scopesObject = scopes[key].scopes;

        // Verifique se o 'entity' corresponde ao valor passado como argumento
        if (scopes[key].entity === entity) {

            // Verifique se o escopo desejado existe no item
            if (scopesObject.hasOwnProperty(scope)) {
                const permissionCode = scopesObject[scope];

                // Verifique se o código de operação está presente no array de códigos de operação
                if (codesPerOperation[operation].indexOf(permissionCode) > -1) {
                    return true; // Código de operação válido, retorne true
                }
            }
        }
    }

    // Percorra os objetos de list
    for (const key in list) {

        const itemObject = list[key]
        const itemId = list[key].id

        // Verifique se itemId é igual a id
        if (itemId === id) {
            
            let permissions = itemObject.process_permissions;

            // Percorra os objetos de permissions
            permissions.forEach(permission => {

                // Verifique se o escopo desejado existe no item
                if (permission.scope === scope) {
                    const permissionCode = permission.code;

                    // Verifique se o código de operação está presente no array de códigos de operação
                    if (codesPerOperation[operation].indexOf(permissionCode) > -1) {
                        return true; // Código de operação válido, retorne true
                    }
                }
            });
        }
    }
    
    return false;
}

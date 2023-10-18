export function cleanField(field) {
    return field.replace(/[^\w\s]/gi, '')
}

const codesPerOperation = {
    1: [1, 3, 5, 7, 9, 11, 13, 15], // 1-Read
    2: [2, 3, 6, 7, 10, 11, 14, 15], // 2-Insert
    4: [4, 5, 6, 7, 12, 13, 14, 15], // 4-Update
    8: [8, 9, 10, 11, 12, 13, 14, 15] // 8-Delete
}

function can(scopes, entity, scope, operation) {
    // Percorra os objetos de escopo
    for (const key in scopes) {
        if (scopes.hasOwnProperty(key)) {
            const entityObject = scopes[key];
            const scopesObject = entityObject.scopes;

            // Verifique se o 'entity' corresponde ao valor passado como argumento
            if (entityObject.entity === entity) {

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
    }

    return false;
}

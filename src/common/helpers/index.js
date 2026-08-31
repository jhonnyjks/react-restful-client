export function cleanField(field) {
    return field.replace(/[^\w\s]/gi, '')
}

const codesPerOperation = {
    1: [1, 3, 5, 7, 9, 11, 13, 15], // 1-Read
    2: [2, 3, 6, 7, 10, 11, 14, 15], // 2-Insert
    4: [4, 5, 6, 7, 12, 13, 14, 15], // 4-Update
    8: [8, 9, 10, 11, 12, 13, 14, 15] // 8-Delete
}

function checkItemPermissions(reduxState, entity, scope, operation, id, codesPerOperation) {
    let entityName = entity.charAt(0).toLowerCase() + entity.slice(1);

    const list =
        reduxState[entityName] &&
        reduxState[entityName].list &&
        reduxState[entityName].list.length > 0
            ? reduxState[entityName].list
            : reduxState[entityName]?.list_update || false;

    for (const key in list) {
        const itemObject = list[key];
        const itemId = list[key].id;

        if (itemId === id) {
            let permissions = itemObject.process_permissions;

            console.log(permissions);

            for (const permission of permissions) {
                if (permission.scope === scope) {
                    const permissionCode = permission.code;

                    if (codesPerOperation[operation].indexOf(permissionCode) > -1) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function checkScopePermission(scopes, entity, scope, operation, codesPerOperation) {
    for (const key in scopes) {
        const scopesObject = scopes[key].scopes;

        if (scopes[key].entity === entity) {
            if (scopesObject.hasOwnProperty(scope)) {
                const permissionCode = scopesObject[scope];

                if (codesPerOperation[operation].indexOf(permissionCode) > -1) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function can(reduxState, entity, scope, operation, id = null) {
    if (!id) {
        const scopes = reduxState.auth.profile.scopes;
        return checkScopePermission(scopes, entity, scope, operation, codesPerOperation);
    } else {
        return checkItemPermissions(reduxState, entity, scope, operation, id, codesPerOperation);
    }
}

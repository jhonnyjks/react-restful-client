export function openCloseSideBar(e) {
    e.preventDefault()
    if (document.body.getAttribute('class').indexOf('sidebar-collapse') > -1) {
        document.body.setAttribute('class', document.body.getAttribute('class').replace('sidebar-collapse', ''))
    } else {
        document.body.setAttribute('class', document.body.getAttribute('class') + ' sidebar-collapse')
    }

    return {
        type: 'SIDE_BAR_OPENED',
        payload: null
    }
}

export function openCloseMiniSideBar(e) {
    if (typeof e === 'object') {
        e.preventDefault()
    }
    if (document.body.getAttribute('class').indexOf('sidebar-open') > -1) {
        document.body.setAttribute('class', document.body.getAttribute('class').replace('sidebar-open', ''))
    } else {
        document.body.setAttribute('class', document.body.getAttribute('class') + ' sidebar-open')
    }

    return {
        type: 'SIDE_BAR_OPENED',
        payload: null
    }
}

export function setSideBar(status) {
    return {
        type: 'SIDE_BAR_STATUS',
        payload: status
    }
}
import axios from 'axios'

function bodyClassName() {
    return document.body.getAttribute('class') || ''
}

export function openCloseSideBar(e) {
    if (e) {
        e.preventDefault();
    }
    const current = bodyClassName()
    if (current.indexOf('sidebar-collapse') > -1) {
        document.body.setAttribute('class', current.replace('sidebar-collapse', '').trim());
    } else {
        document.body.setAttribute('class', `${current} sidebar-collapse`.trim());
    }

    return {
        type: 'SIDE_BAR_OPENED',
        payload: null
    };
}

export function openCloseMiniSideBar(e) {
    if (typeof e === 'object') {
        e.preventDefault()
    }
    const current = bodyClassName()
    if (current.indexOf('sidebar-open') > -1) {
        document.body.setAttribute('class', current.replace('sidebar-open', '').trim())
    } else {
        document.body.setAttribute('class', `${current} sidebar-open`.trim())
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

export function getNotifications() {
    const request = axios
        .get(`${process.env.REACT_APP_API_HOST}/notifications`)
        .catch(() => ({ data: { data: [] } }))

    return {
        type: 'NOTIFICATIONS_FETCHED',
        payload: request
    }
}

export function initNotifications() {
    return {
        type: 'NOTIFICATIONS_CLEANED',
        payload: []
    }
}
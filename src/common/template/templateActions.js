export function openCloseSideBar() {

    if(document.body.getAttribute('class').indexOf('sidebar-open') > -1) {
        document.body.setAttribute('class', document.body.getAttribute('class').replace('sidebar-open', '')) 
    } else {
        document.body.setAttribute('class', document.body.getAttribute('class') + ' sidebar-open')
    }

    return {
        type: 'SIDE_BAR_OPENED',
        payload: null
    }
}

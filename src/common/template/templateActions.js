export function openCloseSideBar() {

    if(document.body.getAttribute('class').indexOf('sidebar-collapse') > -1) {
        document.body.setAttribute('class', document.body.getAttribute('class').replace('sidebar-collapse', '')) 
    } else {
        document.body.setAttribute('class', document.body.getAttribute('class') + ' sidebar-collapse')
    }

    return {
        type: 'SIDE_BAR_OPENED',
        payload: null
    }
}

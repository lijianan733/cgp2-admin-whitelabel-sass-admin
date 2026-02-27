Ext.define('CGP.ticket.store.Ticket', {
    extend: 'Ext.data.Store',
    model: 'CGP.ticket.model.Ticket',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/tickets',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})
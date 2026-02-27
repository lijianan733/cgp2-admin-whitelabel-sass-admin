Ext.define('CGP.ticket.controller.Edit', {


    /**
     * 回复ticket
     * @param ticketId
     * @param subject
     * @param content
     */
    replyTicket: function (ticketId, subject, content) {

        Ext.Ajax.request({
            url: adminPath + 'api/admin/tickets/' + ticketId + '/reply',
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                subject: subject,
                content: content
            },
            callback: function () {
                window.location.reload();
            }
        });

    },

    closeTicket: function (ticketId, comment) {
        Ext.Ajax.request({
            url: adminPath + 'api/admin/tickets/' + ticketId + '/close',
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                comment: comment
            },
            callback: function () {
                window.location.reload();
            }
        });

    },


    showMailContent: function (subject, content) {
        Ext.create('CGP.ticket.view.Mail', {
            subject: subject,
            content: content
        }).show();
    }

})
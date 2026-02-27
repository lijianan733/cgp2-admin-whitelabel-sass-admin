Ext.define('CGP.orderdetails.view.details.StatusConfig', {
    waitingPrint: [1, 2, 3, 11],
    waitingProduce: [4, 5, 6, 12],
    waitingDelivery: [7, 8, 9, 13],
    reprint: [2, 5, 8, 11, 12, 13],
    getStatusColor: function (statusId) {
        var me = this;

        if (Ext.Array.contains(me.waitingPrint, statusId)) {
            return 'red';
        }

        if (Ext.Array.contains(me.waitingProduce, statusId)) {
            return '#FA0';
        }

        if (Ext.Array.contains(me.waitingDelivery, statusId)) {
            return 'green';
        }

        return 'black';
    }
})
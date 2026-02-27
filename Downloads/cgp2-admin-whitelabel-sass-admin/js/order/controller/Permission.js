Ext.define('CGP.order.controller.Permission', {

    funCode: 'ORDER',
    delimiter: '_',

    //button权限映射
    buttons: {
        modifyCustomer: "MODIFYCUSTOMER",
        modifyAddress: 'MODIFYADDRESS',
        modifyStatus: 'MODIFYSTATUS',
        refundApply: 'REFUNDAPPLY',
        downLoadPrintedFiles: 'DOWNLOADPRINTEDFILES',
        modifyPaymentMethod: 'MODIFYPAYMENTMETHOD',
        modifyInvoice: 'MODIFYINVOICE',
        orderDetails: 'ORDERDETAILS',
        orderReprint: 'ORDERREPRINT',
        orderRedo: 'ORDERREDO',
        replenishment: 'REPLENISHMENT',
        orderAudit: 'AUDIT',
        orderReport: 'REPORT',
        voacherPrint: 'VOACHERPRINT',
        printAgain: 'PRINTAGAIN',
        modifyOrderTotal: 'MODIFYORDERTOTAL',
        printInvoice: 'PRINTINVOICE',
        orderPriceAndQty: 'PRICEANDQUANTITY',
        checkCostInfo: 'CHECKCOSTINFO_READ'
    },


    //是否该button起作用
    checkPermission: function (button) {
        //不存在该button 不进行权限控制
        if (!this.buttons[button])
            return true;
        return this.buttons[button] === true;//判断是否允许
    },
    constructor: function () {
        var me = this;
        me.initButtons();
    },


    initButtons: function (permissions, buttons) {
        var me = this;
        var permissions = me.initPermissions();

        var callback = function (resp) {
            var results = eval('(' + resp.responseText + ')').data;
            var i = 0;
            Ext.Object.each(me.buttons, function (k, v) {
                me.buttons[k] = results[i] === true;
                i++;
            })
        };
        JSCheckPermission(permissions, callback, false);
    },
    initPermissions: function () {
        var me = this;
        var permissions = [];
        Ext.Object.each(me.buttons, function (k, v) {
            if (typeof v === 'string'){
                permissions.push('AUTH' + me.delimiter + me.funCode.toUpperCase() + me.delimiter + v?.toUpperCase());
            }
        })

        return permissions;
    }

})
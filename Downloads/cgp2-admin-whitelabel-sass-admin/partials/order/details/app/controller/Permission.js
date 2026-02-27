Ext.define('CGP.orderdetails.controller.Permission', {

    delimiter: '_',

    //button权限映射
    buttons: {
        singleDelivery: 'PRODUCE_SINGLE_DELIVERY',
        detailSubmit: 'ORDER_DETAIL_SUBMIT'
    },

    //是否该button起作用
    checkPermission: function (button) {
        //不存在该button 不进行权限控制
        if (!this.buttons[button])
            return true;
        return this.buttons[button] === true;
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
                if (results[i] === true) {
                    me.buttons[k] = true;
                }
                i++;
            })
        };
        JSCheckPermission(permissions, callback, false);
    },
    initPermissions: function () {
        var me = this;
        var permissions = [];
        Ext.Object.each(me.buttons, function (k, v) {
            permissions.push('AUTH' + me.delimiter + v.toUpperCase());
        })
        return permissions;
    }

})
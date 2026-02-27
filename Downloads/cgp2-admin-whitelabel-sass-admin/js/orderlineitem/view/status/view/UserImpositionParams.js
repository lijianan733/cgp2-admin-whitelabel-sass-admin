Ext.define('CGP.orderlineitem.view.status.view.UserImpositionParams', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    modal: true,
    orderItemId: 0,
    confirmHandler: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.orderlineitem.view.status.controller.Status');
        me.items = [
            //Ext.create('CGP.orderlineitem.view.UserParamsValue',{})
            Ext.create('CGP.materialviewtype.view.TreeField', {
                // fieldLabel: i18n.getKey('userParams'),
                name: 'rtObject',
                itemId: 'rtObject',
                isSetValue: true,
                margin: '10',
                allowBlank: false
            })
        ];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: me.confirmHandler || function (btn) {
                    controller.saveUserParams(btn);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    this.ownerCt.ownerCt.close();
                }
            }
        ]
        me.callParent(arguments);
        if (me.orderItemId) {
            // controller.setUserParams(me);
            me.reflashData();
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var data = {};
        data = me.items.items[0].getJsonObjectValue();
        return data;
    },
    reflashData: function () {
        var me = this;
        var itemUserParams = Ext.data.StoreManager.lookup('itemUserParams');
        itemUserParams.each(function (recd) {
            var data = recd.data;
            Ext.Function.defer(function () {
                me.setValue(data);
            }, 500);

        })
    },
    setValue: function (data) {
        var me = this;
        if (data) {
            var paramsData = {};
            paramsData['designType'] = data.userParams;
            if (data.userParamDefaultValues && data.userImpositionParams && JSON.stringify(data.userImpositionParams) != '{}') {
                data.userParamDefaultValues.objectJSON = data.userImpositionParams;
            }
            paramsData['predesignObject'] = data.userParamDefaultValues;
            me.items.items[0].setSubmitValue(paramsData, true);
        }
    }
})
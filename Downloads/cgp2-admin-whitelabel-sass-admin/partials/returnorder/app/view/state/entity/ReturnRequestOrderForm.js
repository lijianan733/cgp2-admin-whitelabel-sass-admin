/**
 * returnOrder
 * @Author: miao
 * @Date: 2022/1/4
 */
Ext.define("CGP.returnorder.view.state.entity.ReturnRequestOrderForm", {
    extend: "Ext.form.Panel",
    alias: 'widget.returnform',
    requires: ["CGP.orderlineitem.model.OrderLineItem"],
    autoScroll: false,
    scroll: 'vertical',
    layout: {
        type: 'table',
        columns: 2
    },
    // border: 0,
    fieldDefaults: {
        labelAlign: 'right',
        width: 400,
        labelWidth: 100,
        msgTarget: 'side',
        readOnly: true
    },
    entityId:null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textfield',
                itemId: 'returnRequestOrderNo',
                name: 'returnRequestOrderNo',
                fieldLabel: i18n.getKey('returnRequestOrderNo'),
            },
            {
                xtype: 'textfield',
                itemId: 'applyDate',
                name: 'applyDate',
                fieldLabel: i18n.getKey('applyDate'),
            },

            {
                xtype: 'numberfield',
                itemId: 'qty',
                name: 'qty',
                fieldLabel: i18n.getKey('salesReturn')+i18n.getKey('qty'),
            },
            {
                xtype: 'textfield',
                itemId: 'reason',
                name: 'reason',
                fieldLabel: i18n.getKey('salesReturn')+i18n.getKey('reason'),
            },

            {
                xtype: 'numberfield',
                itemId: 'price',
                name: 'price',
                fieldLabel: i18n.getKey('price'),
            },
            {
                xtype: 'numberfield',
                itemId: 'total',
                name: 'total',
                fieldLabel: i18n.getKey('total'),
            },

            {
                xtype: 'textarea',
                itemId: 'description',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                colspan: 2,
                width:800
            },
            {
                xtype: 'textfield',
                itemId: 'orderItem',
                name: 'orderItem',
                fieldLabel: i18n.getKey('orderLineItem'),
            },
            {
                xtype: 'numberfield',
                itemId: 'lineItemQty',
                name: 'lineItemQty',
                fieldLabel: i18n.getKey('orderLineItem')+i18n.getKey('qty'),
            },
            {
                xtype: 'uxfieldset',
                title: i18n.getKey('product')+i18n.getKey('information'),
                name:'productInfor',
                colspan: 2,
                width: 800,
                // margin:'0 15',
                style: {
                    padding: '5',
                    borderRadius: '4px'
                },
                items: [
                    {
                        xtype: 'productinfor',
                        border: 0,
                        width: "100%",
                        isCountryTax: true,
                        data: null
                    }
                ],

                diySetValue: function (data) {
                    var me = this;
                    me.items.items[0].setValue(data);
                }
            },
            {
                xtype: 'textfield',
                itemId: 'currentState',
                name: 'currentState',
                fieldLabel: i18n.getKey('status'),
                colspan: 2,
                width:800
            },
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: {
            fn: function (comp) {
                if (comp.entityId) {
                    var returnOrderModel = Ext.ModelManager.getModel("CGP.returnorder.model.ReturnRequestOrder");
                    returnOrderModel.load(parseInt(comp.entityId), {
                        success: function (record, operation) {
                            comp.setValue(record.data);
                            ///todo:API of lineItem getById well be support property of symbol
                            // var lineItemModel=Ext.ModelManager.getModel("CGP.orderlineitem.model.OrderLineItem");
                            // lineItemModel.load(record.get('orderItem')._id,{
                            //     success: function (rec, operation) {
                            //         comp.getComponent('price').setValue(rec.get('price')+rec.get('symbol'));
                            //         comp.getComponent('total').setValue(rec.get('price')*record.get('qty')+rec.get('symbol'));
                            //     }
                            // })
                        }
                    });
                }
            }, single: true
        }
    },
    isValid: function () {
        if (this.isValidForItems == true) {//以form.items.items为遍历
            var isValid = true,
                errors = {};
            this.items.items.forEach(function (f) {
                if (!f.hidden && !f.isValid()) {
                    var errorInfo = f.getErrors();
                    if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                        errors = Ext.Object.merge(errors, errorInfo);
                    } else {
                        errors[f.getFieldLabel()] = errorInfo;
                    }
                    isValid = false;

                }
            });
            return isValid;
        } else {//以form.getFields为遍历
            var isValid = this.callParent(arguments),
                errors = {};
            if (!isValid) {
                this.form.getFields().each(function (f) {
                    if (!f.isValid()) {
                        errors[f.getFieldLabel()] = f.getErrors();
                    }
                });
            }
            return isValid;
        }
    },

    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        me.data = data;
        for (var item of items) {
            if (item.diySetValue) {
                item.diySetValue(data);
            }
            else if(item.name=='orderItem'){
                var val=data.orderNo+'-'+(data[item.name]?.seqNo??1);
                item.setValue(val);
            }
            else if(item.name=='reason'){
                item.setValue(data[item.name]?.name);
            }
            // else if(item.name=='price'||item.name=='total'){
            //     continue;
            // }
            else if(item.name=='price'){
                item.setValue(data['orderItem'].price);
            }
            else if(item.name=='total'){
                item.setValue(data['orderItem'].price*data['qty']);
            }
            else if(item.name=='currentState'){
                item.setValue(data[item.name]?.state?.name||data[item.name]?.state?.key);
            }
            else if(item.name=='applyDate'){
                item.setValue(Ext.Date.format(data[item.name], 'Y/m/d H:i'));
            }
            else {
                item.setValue(data[item.name]);
            }
        }
    },
    getName: function () {
        var me = this;
        return me.name;
    },

});
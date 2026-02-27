Ext.define('CGP.common.reprint.view.Selector', {
    extend: 'Ext.window.Window',
    alias: 'widget.reprintselector',
    requires: [
        'CGP.common.reprint.view.PopStorage',
        'CGP.common.reprint.view.Apply'
    ],


    applyStatus: {
        printed: 'printed',
        produced: 'produced',
        deliveried: 'deliveried'
    },

    modal: true,
    title: '选择补印产品',
    width: 400,
    height: 200,

    initComponent: function () {
        var me = this,
            applyStatus = this.applyStatus,
            record = this.record,
            controller = this.controller;



        var statusId = record.get('statusId');
        var id = record.get('id');
        var printedQty = record.get('printedQty');
        var producedQty = record.get('producedQty');
        var deliveriedQty = record.get('deliveriedQty');

        var printedStatusQty = printedQty - producedQty;
        var producedStatusQty = producedQty - deliveriedQty;
        var deliveriedStatusQty = deliveriedQty;

        var items = [];

        //已打印状态的产品补印
        if (statusId != 2) {
            if (printedStatusQty) {
                items.push(me.createSelectItem(i18n.getKey('printed'), printedStatusQty, function () {
                    var fieldContainer = this.ownerCt;
                    var window = fieldContainer.ownerCt;
                    var qty = fieldContainer.getComponent('qty').getValue().match(/\d+/g)[1];
                    window.close();
                    me.applyReprint(id, Ext.Number.from(qty), applyStatus.printed);

                }));
            }
        }

        //已生产产品的补印
        if (producedStatusQty) {
            if (!Ext.isEmpty(record.get('storageInfo'))) {
                items.push(me.createSelectItem(i18n.getKey('produced'), producedStatusQty, function () {
                    this.ownerCt.ownerCt.close(0);
                    var window = Ext.widget('reprintpopstorage', {
                        reprintWindow: me,
                        record: record,
                        callback: me.callback
                    });
                    window.show();
                }));
            } else {
                items.push(me.createSelectItem(i18n.getKey('produced'), producedStatusQty, function () {
                    var fieldContainer = this.ownerCt;
                    var window = fieldContainer.ownerCt;
                    var qty = fieldContainer.getComponent('qty').getValue().match(/\d+/g)[1];
                    window.close();
                    me.applyReprint(id, Ext.Number.from(qty), applyStatus.produced);

                }));
            }
        }

        if (deliveriedQty) {
            items.push(me.createSelectItem(i18n.getKey('deliveried'), deliveriedQty, function () {
                var fieldContainer = this.ownerCt;
                var window = fieldContainer.ownerCt;
                var qty = fieldContainer.getComponent('qty').getValue().match(/\d+/g)[1];
                window.close();
                me.applyReprint(id, Ext.Number.from(qty), applyStatus.deliveried);

            }));
        }

        if (items.length == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), '没有可以进行补印的产品！');
            return;
        }

        me.items = items;


        me.callParent(arguments);
    },


    createSelectItem: function (text, qty, handler) {


        var fontSize = 16;
        return {
            xtype: 'fieldcontainer',
            fieldLabel: text,
            labelWidth: 60,
            labelStyle: 'font-size:' + fontSize + 'px',
            layout: {
                type: 'table',
                columns: 2
            },
            items: [{
                xtype: 'displayfield',
                itemId: 'qty',
                value: '<span style="font-size:' + fontSize + 'px">' + qty + '</font>',
                style: 'margin-right:20px'
            }, {
                xtype: 'button',
                text: i18n.getKey('applyReprint'),
                handler: handler
            }]
        }
    },
    applyReprint: function (itemId, maxQty, paramName) {
        var me = this;
        var window = Ext.widget({
            xtype: 'reprintapply',
            reprintWindow: me,
            itemId: itemId,
            maxQty: maxQty,
            paramName: paramName,
            callback: me.callback
        });
        window.show();
    }
})
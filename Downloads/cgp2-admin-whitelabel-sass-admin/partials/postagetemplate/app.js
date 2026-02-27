Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '../../ux');

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.form.field.Number',
    'Ext.form.field.Date',
    'Ext.tip.QuickTipManager'
]);

Ext.define('PostageTemplate', {
    extend: Ext.data.Model,
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'area',
        type: 'string'
    }, {
        name: 'startWeight',
        type: 'float'
    }, {
        name: 'endWeight',
        type: 'float'
    }, {
        name: 'firstWeight',
        type: 'float'
    }, {
        name: 'firstFee',
        type: 'float'
    }, {
        name: 'plusWeight',
        type: 'float'
    }, {
        name: 'plusFee',
        type: 'float'
    }, {
        name: 'extraFeeRate',
        type: 'int'
    }, {
        name: 'amountPromotion',
        type: 'float'
    }, {
        name: 'promotion',
        type: 'float'
    }]
})

Ext.onReady(function () {

    Ext.tip.QuickTipManager.init();


    var data = [
        {
            id: 1,
            startWeight: 0.1,
            endWeight: 1.0,
            plusFee: 0.0,
            firstWeight: 0.1,
            firstFee: 20.0,
            amountPromotion: 128.0,
            promotion: 10.0,
            extraFeeRate: 0,
            plusWeight: 1.0,
            area: '广东'
    }, {
            id: 2,
            startWeight: 0.1,
            endWeight: 1.0,
            plusFee: 0.0,
            firstWeight: 0.1,
            firstFee: 20.0,
            amountPromotion: 128.0,
            promotion: 10.0,
            extraFeeRate: 0,
            plusWeight: 1.0,
            area: '江西'
    }, {
            id: 3,
            startWeight: 0.1,
            endWeight: 1.0,
            plusFee: 0.0,
            firstWeight: 0.1,
            firstFee: 20.0,
            amountPromotion: 128.0,
            promotion: 10.0,
            extraFeeRate: 0,
            plusWeight: 1.0,
            area: '北京'
    }, {
            id: 4,
            startWeight: 0.1,
            endWeight: 1.0,
            plusFee: 0.0,
            firstWeight: 0.1,
            firstFee: 20.0,
            amountPromotion: 128.0,
            promotion: 10.0,
            extraFeeRate: 0,
            plusWeight: 1.0,
            area: '上海'
    }
    ];


    var store = Ext.create('Ext.data.Store', {
        model: 'PostageTemplate',
        data: data,
        groupField: 'area',
        sorters: {
            property: 'startWeight',
            direction: 'ASC'
        }
    });

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

    var grid = Ext.create('Ext.grid.Panel', {
        width: 800,
        height: 450,
        frame: true,
        title: 'Postage Template',
        iconCls: 'icon-grid',
        renderTo: document.body,
        store: store,


        /*selModel: {
            selType: 'cellmodel'
        },*/
        features: [{
            ftype: 'grouping',
            groupHeaderTpl: '{name}'
        }],
        columns: [{
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'icon_remove',
                handler: function (view, rowIndex, colIndex) {
                    var store = view.getStore();
                    var record = store.getAt(rowIndex);
                    store.remove(record);
                }
            }]
        }, {
            text: '起始重量',
            dataIndex: 'startWeight'
        }, {
            text: '最大重量',
            dataIndex: 'endWeight'
        }, {
            text: '最低标准重量',
            dataIndex: 'firstWeight'
        }],
        tbar: [{
            xtype: 'button',
            text: '增加地区',
            handler: function () {
                var window = Ext.create('Ext.window.Window', {
                    modal: true,
                    width: 500,
                    height: 300,
                    title: '增加地区',
                    items: [{
                        xtype: 'textfield',
                        name: 'area'
                    }, {
                        xtype: 'numberfield',
                        name: 'startWeight'
                    }, {
                        xtype: 'numberfield',
                        name: 'endWeight'
                    }, {
                        xtype: 'numberfield',
                        name: 'firstWeight'
                    }],
                    bbar: [{
                        xtype: 'button',
                        text: '增加',
                        handler: function () {
                            var cmp = this.ownerCt.ownerCt;
                            grid.getStore().insert(0, {
                                startWeight: cmp.query('numberfield[name=startWeight]')[0].getValue(),
                                endWeight: cmp.query('numberfield[name=endWeight]')[0].getValue(),
                                firstWeight: cmp.query('numberfield[name=firstWeight]')[0].getValue(),
                                area: cmp.query('textfield[name=area]')[0].getValue()
                            });
                            cmp.close();
                        }
                    }]
                });

                window.show();
            }
        }]
    });
});
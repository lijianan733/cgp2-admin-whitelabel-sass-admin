Ext.define("CGP.product.view.productattributeprofile.view.DragDropGrid", {
    extend: "Ext.panel.Panel",

    //region: 'center',
    width: 500,
    layout: {
        type: 'hbox',
        align: 'stretch',
        padding: 5
    },
    defaults: {
        flex: 1
    },
    initComponent: function () {
        var me = this;

        me.title = false;
        var controller = me.controller;
        var leftStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int'
                },
                {
                    name: 'name',
                    type: 'string',
                    convert: function (value, record) {
                        return value + '<' + record.get('id') + '>'
                    }},
                {
                    name: 'attributeName',
                    type: 'string'
                },
                {name: 'belongGroup', type: 'string'}
            ],
            data: []
        });
        var rightStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int'
                },
                {
                    name: 'name',
                    type: 'string',
                    convert: function (value, record) {
                        return value + '<' + record.get('id') + '>'
                    }},
                {
                    name: 'attributeName',
                    type: 'string'
                },
                {name: 'belongGroup', type: 'string'}
            ],

            data: []
        });
        var leftGrid = Ext.create("Ext.grid.Panel", me.leftGridConfig);
        me.leftGrid = leftGrid;
        var rightGrid = Ext.create("Ext.grid.Panel", me.rightGridConfig);
        me.rightGrid = rightGrid;
        var buttonPanel = Ext.create("Ext.panel.Panel", {
            layout: 'column',
            bodyStyle: 'margin-top:200px',
            border: false,
            width: 20,
            defaults: {
                columnWidth: 1
            },
            flex: 0.07,
            items: [
                {
                    xtype: 'button',
                    text: " ",
                    iconCls: 'icon_ux_left',
                    handler: function (button) {
                        var attributes = rightGrid.getSelectionModel().getSelection();
                        leftGrid.getStore().loadData(attributes, true);
                        rightGrid.getStore().remove(attributes);
                    }
                },
                {
                    style: 'margin-top:20px',
                    xtype: 'button',
                    text: " ",
                    iconCls: 'icon_ux_right',
                    handler: function (button) {
                        var attributes = leftGrid.getSelectionModel().getSelection();
                        rightGrid.getStore().loadData(attributes, true);
                        leftGrid.getStore().remove(attributes);
                    }
                }
            ]
        });
        me.items = [leftGrid, buttonPanel, rightGrid];

        me.callParent(arguments);
    }
})
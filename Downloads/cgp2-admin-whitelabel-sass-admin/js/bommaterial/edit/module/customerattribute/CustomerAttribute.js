Ext.define("CGP.bommaterial.edit.module.customerattribute.CustomerAttribute", {
    extend: "Ext.grid.Panel",

    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('customAttribute');
        var notOptional = ['TextField', 'TextArea', 'Date', 'File', 'Canvas', 'DiyConfig', 'DiyDesign'];
        me.store = Ext.create("CGP.bommaterial.store.CustomerAttribute", {
            data: me.data.customAttributes || []
        })
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('update'),
                        handler: function(view, rowIndex, colIndex,a,b,record){
                            var store = me.getStore();
                            var editOrNew = 'modify';
                            me.controller.customerAttriWin(store,record,editOrNew);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        handler: function (view, rowIndex, colIndex,a,b,record) {
                            var store = view.getStore();
                            store.removeAt(rowIndex);
                        }
                    }
                ]
            },
            {
                dataIndex: 'name',
                text: i18n.getKey('name'),
                itemId: 'name'

            },{
                dataIndex: 'readonly',
                text: i18n.getKey('readonly'),
                itemId: 'readonly'
            },
            {
                dataIndex: 'required',
                text: i18n.getKey('required'),
                itemId: 'required'
            },
            {
                dataIndex: 'validationExp',
                text: i18n.getKey('validationExp'),
                itemId: 'validationExp'
            },
            {
                dataIndex: 'sortOrder',
                text: i18n.getKey('sortOrder'),
                itemId: 'sortOrder'
            },
            {
                dataIndex: 'valueType',
                text: i18n.getKey('valueType'),
                itemId: 'valueType'
            },
            {
                dataIndex: 'valueDefault',
                text: i18n.getKey('valueDefault'),
                itemId: 'valueDefault'
            },
            {
                dataIndex: 'selectType',
                text: i18n.getKey('selectType'),
                itemId: 'selectType'
            },{
                dataIndex: 'description',
                text: i18n.getKey('description')
            },
            {
                text: i18n.getKey('options'),
                dataIndex: 'options',
                width: 370,
                xtype: 'arraycolumn',
                itemId: 'options',
                sortable: false,
                lineNumber: 2,
                renderer : function(value,metadata){
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    metadata.style = "font-weight:bold";
                    return value['name'];
                }
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('addCustomAttr'),
                handler: function () {
                    var grid = this.ownerCt.ownerCt;
                    var editOrNew = 'add'
                    me.controller.customerAttriWin(grid.getStore(),null,editOrNew);
                }
            }
        ];
        me.callParent(arguments);
        me.content = me;
    },
    getValue: function () {
        var me = this;
        var customAttributes = [];
        me.store.data.items.forEach(function (item) {

            var attributeData = item.data;
            if (attributeData.id <= 0) {
                attributeData.id = null;
            }
            if(attributeData.selectType)
            customAttributes.push(attributeData);
        })
        return customAttributes;
    },
    copy: function (data) {
        var me = this;
        me.store.data.items.forEach(function (item) {
            item.data.id = -item.data.id;
            Ext.Array.each(item.data.options, function (option) {
                option.id = -option.id;
            })

        })

        Ext.Array.each(data.customAttributes, function (ca) {
            ca.id = null;
            Ext.Array.each(ca.options, function (option) {
                option.id = null;
            })
        })

    }
})
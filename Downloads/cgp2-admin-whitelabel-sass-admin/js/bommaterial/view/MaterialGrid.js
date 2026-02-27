Ext.define("CGP.bommaterial.view.MaterialGrid", {
    extend: 'CGP.common.field.SearchGrid',

    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.bommaterial.store.MaterialStore');
        store.load();
        me.gridCfg = {
            store: store,
            deleteAction: false,
            editAction: false,
            selType: 'rowmodel',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width : 60,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    sortable: false,
                    renderer : function(value,metadata){
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        metadata.style = "font-weight:bold";
                        return value;
                    }

                }, {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    xtype: 'gridcolumn',
                    width: 200,
                    itemId: 'code',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value ;
                    }
                }, {
                    text: i18n.getKey('bomMaterialAttributeSet'),
                    dataIndex: 'attributeSetName',
                    width: 150,
                    xtype: 'gridcolumn',
                    itemId: 'attributeSetName'
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 300,
                    itemId: 'description',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value ;
                    }
                }
            ]

        };
        me.filterCfg = {
            height: 100,
            header: false,
            fieldDefaults: {
                labelAlign: 'right',
                layout: 'anchor',
                width: 260,
                labelWidth: 60,
                style: 'margin-right:10px; margin-top : 5px;'
            },
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars : true,
                allowExponential: false,
                allowDecimals : false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                id: 'codeSearchField',
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            },{
                id: 'attributeSetName',
                name: 'attributeSetName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('bomMaterialAttributeSet'),
                itemId: 'attributeSetName'
            }, {
                id: 'descriptionSearchField',
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }]
        };
        me.callParent(arguments);
    }
});
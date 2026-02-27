Ext.onReady(function () {


    var store = Ext.create("CGP.bommaterial.store.MaterialStore",{
        autoLoad: true
    });

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('bommaterial'),
        block: 'bommaterial',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                /*{
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },*/{
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
                    width: 250,
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
                    width: 250,
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
                    width: 300,
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value ;
                    }
                }]
        },
        filterCfg: {
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
        }
    });
});
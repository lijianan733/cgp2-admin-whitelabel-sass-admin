Ext.define("CGP.cmspage.view.PreviewPage",{
    extend : 'CGP.common.commoncomp.QueryGrid',

    websiteId : null,
    outputUrl: null,
    page: null,
    mainCategoryStore : null,
    subCategoryStore : null,

    minWidth : 500,
    constructor : function(config){
        var me = this;

        me.callParent(arguments);

    },

    initComponent : function(){
        var me = this;
        var store = Ext.create("CGP.cmspage.store.ProductStore");
     /*   me.mainCategoryStore = Ext.create("CGP.promotionrule.store.MainCategoryTree",{
            root : {
                id : -me.websiteId,
                name: 'category'
            }
        });*/
     /*   me.subCategoryStore = Ext.create("CGP.promotionrule.store.SubCategoryTree",{
            root : {
                id : -me.websiteId,
                name : 'category'
            }
        });*/


        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            id: 'previewPage',
            selType: 'rowmodel',
            store :store,
            columns : [{
                text : i18n.getKey('id'),
                dataIndex : 'id',
                width : 60,
                itemId : 'id'
            },{
                xtype: 'componentcolumn',
                itemId: "preview",
                width: 80,
                sortable: false,
                renderer: function (value, metaData, record, rowIndex) {
                    return new Ext.button.Button({
                        text: i18n.getKey('preview'),
                        itemId: 'preview',
                        handler: function () {
                            var id = record.get('id');
                            Ext.Ajax.request({
                                url: adminPath + 'api/admin/cmsPage/'+me.websiteId+'/preview?url='+me.outputUrl+'&id='+id,
                                method: 'GET',
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if(responseMessage.success){
                                        window.open(responseMessage.data);
                                    }else{
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'),responseMessage.data.message);
                                }
                            });
                            //window.open('http://192.168.26.28:8888/cgp-cms/websites/'+me.websiteId+'/pages?url='+me.outputUrl+'&id='+id);
                        }
                    });

                }
            },{
                text: i18n.getKey('type'),
                dataIndex: 'type',
                xtype: 'gridcolumn',
                itemId: 'type'
            },
                {
                    text: i18n.getKey('sku'),
                    dataIndex: 'sku',
                    autoSizeColumn: false,
                    width: 120,
                    xtype: 'gridcolumn',
                    itemId: 'sku'
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name'
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    xtype: 'gridcolumn',
                    itemId: 'model'
                },
                {
                    text: i18n.getKey('maincategory'),
                    dataIndex: 'mainCategory',
                    xtype: 'gridcolumn',
                    itemId: 'mainCategory',
                    renderer: function (mainCategory) {
                        return mainCategory.name;
                    }
                },
                {
                    text: i18n.getKey('subCategories'),
                    dataIndex: 'subCategories',
                    xtype: 'gridcolumn',
                    itemId: 'subCategories',
                    renderer: function (subCategories) {
                        var value = [];
                        Ext.Array.each(subCategories, function (subCategory) {
                            value.push(subCategory.name);
                        })
                        return value.join(",");
                    }
                }]

        };
        me.filterCfg = {
            height : 90,
            header: false,
            defaults : {
                width : 280
            },
            items : [{
                name : 'id',
                xtype : 'numberfield',
                fieldLabel : i18n.getKey('id'),
                itemId : 'id',
                minValue : 1,
                allowDecimals : false,
                allowExponential : false,
                hideTrigger : true
            },{
                name: 'type',
                xtype: 'combo',
                fieldLabel: i18n.getKey('type'),
                itemId: 'type',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['type', "value"],
                    data: [
                        {
                            type: 'Sku', value: 'SKU'
                        },
                        {
                            type: 'Configurable', value: 'Configurable'
                        }
                    ]
                }),
                displayField: 'type',
                valueField: 'value',
                hidden: true,
                value: 'SKU',
                queryMode: 'local'
            },  {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                hidden: true
            },{
                name: 'mainCategory.website.id',
                xtype: 'combobox',
                fieldLabel: i18n.getKey('website'),
                itemId: 'website',
                store: Ext.create("CGP.promotionrule.store.Website"),
                displayField: 'name',
                valueField: 'id',
                editable: false,
                hidden: true,
                value : me.websiteId || 11
            }, {
                name: 'mainCategory',
                xtype: 'productcategorycombo',
                fieldLabel: i18n.getKey('maincategory'),
                itemId: 'mainCategory',
                isMain: true,
                websiteSelectorEditable: me.websiteId ? false : true,
                defaultWebsite: me.websiteId || 38,
              /*  store: me.mainCategoryStore,*/
                displayField: 'name',
                valueField: 'id',
                selectChildren: false,
                canSelectFolders: true,
                multiselect: true
            }, {
                name: 'subCategories',
                xtype: 'productcategorycombo',
                isMain: false,
                websiteSelectorEditable: me.websiteId ? false : true,
                defaultWebsite: me.websiteId || 38,
                fieldLabel: i18n.getKey('subCategories'),
                itemId: 'subCategories',
              /*  store: me.subCategoryStore,*/
                displayField: 'name',
                valueField: 'id',
                selectChildren: false,
                canSelectFolders: true,
                multiselect: true
            }]
        };
        me.callParent(arguments);
    }
});

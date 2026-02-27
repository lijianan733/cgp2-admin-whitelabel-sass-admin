/**
 * 批量生成时，已选择的页面显示窗口
 */
Ext.define('CGP.cmspage.view.SelectedPageWin',{
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    width: 800,
    maxHeight:500,
    y: 250,
    id: 'createPageWin',
    selectProductList: {},
    autoShow: true,
    /**
     * 保存已选择的页面数据的方法
     * @param {Object} pageListObj
     */
    addPageData: function (pageListObj) {
        this.pageDataList = Ext.Object.merge(this.pageDataList, pageListObj);
    },
    /**
     * 保存本窗口已选择的产品数据的方法
     * @param {Object} selectProList
     */
    addProductData: function (selectProList){
        this.selectProductList = Ext.Object.merge(this.selectProductList,selectProList);
    },

    initComponent: function(){
        var me = this;

        me.pageDataList = {};
        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int',
                    useNull: true
                },
                {
                    name: 'type',
                    type: 'string'
                },
                {
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'description',
                    type: 'string'
                },
                {
                    name: 'outputUrl',
                    type: 'string'
                },
                {
                    name: 'pageTitle',
                    type: 'string'
                },
                {
                    name: 'pageKeywords',
                    type: 'string'
                },
                {
                    name: 'pageDescription',
                    type: 'string'
                },
                {
                    name: 'websiteId',
                    type: 'int'
                }
            ],
            data: me.data
        });
        var grid = Ext.create('Ext.grid.Panel', {
            header: false,
            //selType: 'checkboxmodel',
            store: store,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 60,
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
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        metadata.style = "font-weight:bold";
                        return value;
                    }

                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: false
                },
                {
                    text: i18n.getKey('website'),
                    dataIndex: 'websiteId',
                    xtype: 'gridcolumn',
                    itemId: 'website',
                    sortable: false,
                    renderer: function (value) {
                        var websiteModel = me.website.getById(value);
                        return websiteModel.get('name');
                    }
                },
                {
                    sortable: false,
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metaData, record, rowIndex) {
                        var websiteId = record.get('websiteId');
                        var pageId = record.get('id');
                        var pageName = record.get('name');
                        var collection = new Ext.util.MixedCollection();
                        me.collection = collection;
                        if (record.get('type') == 'normal') {
                            return null;
                        } else {
                            return new Ext.button.Button({
                                text: '<div style="color: #666666">' + i18n.getKey('selectProduct ')+ '</div>',
                                frame: false,
                                width: 90,
                                style: {
                                    background: '#F5F5F5'
                                },
                                handler: function showWin() {
                                    if(/*Ext.isEmpty(pageWin.pageDataList) || */Ext.isEmpty(me.pageDataList[pageId])){

                                    }else{
                                        var pageProductList = me.pageDataList[pageId];
                                        //if(pageProductList)
                                        for(var i = 0;i< pageProductList.length;i++){
                                            var productId = pageProductList[i].productId;
                                            collection.add(productId,productId);
                                        }
                                    }
                                    me.tbarController.showBatchCreateSelectProductWin(websiteId, pageId, pageName,collection);
                                }
                            });
                        }
                    }
                }
            ]
        });
        me.title= i18n.getKey('selectedPage');
        me.bbar= [
            '->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function cinfirm() {
                    me.tbarController.batchCreatePage(me);
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function (btn) {
                    me.close();
                }
            }];
        me.items= [grid];
        me.callParent(arguments);
    }
})
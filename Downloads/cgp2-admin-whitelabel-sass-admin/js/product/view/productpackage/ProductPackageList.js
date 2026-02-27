Ext.define("CGP.product.view.productpackage.ProductPackageList", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    minWidth: 300,
    height: 400,
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },

    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int',
                    useNull: true
                },
                {
                    name: 'name',
                    type: 'string'
                },{
                    name:'imageUrl',
                    type: 'string'
                },{
                    name: 'needPrint',
                    type: 'boolean'
                }
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/admin/product/'+me.productId+'/package',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });

        me.gridCfg = {
            store: store,
            deleteAction: false,
            pagingBar: false,
            selType: 'rowmodel',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 60,
                    tdCls: 'vertical-middle',
                    itemId: 'id'
                },
                {
                    xtype: 'actioncolumn',
                    width : 60,
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [{
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('delete'),
                        handler: function (view, rowIndex, colIndex,item,e,record) {
                            Ext.MessageBox.confirm('提示', '是否删除该产品部件?', callBack);
                            function callBack(id) {
                                //var selected = me.getSelectionModel().getSelection();
                                if (id === "yes") {
                                    var requestConfig = {
                                        url: adminPath + 'api/admin/product/'+me.productId+'/packages/'+record.get('id'),
                                        method: 'DELETE',
                                        headers: {Authorization: 'Bearer '+Ext.util.Cookies.get('token')},
                                        success: function(resp){
                                            record.store.remove(record);
                                        }
                                    }
                                    Ext.Ajax.request(requestConfig);
                                    //store.sync();
                                }else{
                                    close();
                                }
                            }
                        }
                    }]
                },
                {
                    dataIndex: 'imageUrl',
                    text: i18n.getKey('image'),
                    itemId: 'imageUrl',
                    renderer: function (value, metadata, record) {
                        var url = value + '/100/100/png';
                        return '<img src="' + url + '" />';
                    }
                },
                {
                    dataIndex: 'needPrint',
                    text: i18n.getKey('needPrint'),
                    tdCls: 'vertical-middle',
                    itemId: 'needPrint',
                    renderer: function(value){
                        if(value == true){
                            return '是';
                        }else{
                            return '否';
                        }
                    }

                },
                {
                    dataIndex: 'isCustomized',
                    text: i18n.getKey('isCustomized'),
                    tdCls: 'vertical-middle',
                    itemId: 'isCustomized',
                    renderer: function(value){
                        if(value == true){
                            return '是';
                        }else{
                            return '否';
                        }
                    }

                },
                {
                    text: i18n.getKey('name'),
                    width: 390,
                    tdCls: 'vertical-middle',
                    dataIndex: 'name',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value ;
                    }
                }
            ]

        };
        me.filterCfg = {
            height: 90,
            hidden:true,
            header: false,
            items: []
        };
        me.callParent(arguments);
    }
});
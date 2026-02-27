Ext.define("CGP.product.view.productpackage.AllPackageList", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },

    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product.view.productpackage.AllPackageStore',{
            /*filters: [
                function(item) {
                    return item.id != 0;
                }
            ]*/
        });
        var filterData = me.allPackageWin.filterData;
        me.gridCfg = {
            store: store,
            id: 'allProductPackage',
            editAction: false,
            selType: 'rowmodel',
            deleteAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 60,
                    tdCls: 'vertical-middle',
                    itemId: 'id'
                },{
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
                    dataIndex: 'name',
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value ;
                    }
                },{
                    xtype: 'componentcolumn',
                    itemId: "choice",
                    width: 90,
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer:function(value, metaData, record, rowIndex){
                        var id = record.get('id');
                        return new Ext.button.Button({
                            text: i18n.getKey('choice'),
                            itemId: 'choice',
                            handler: function () {
                                me.allPackageWin.controller.modifyProductPackage(me.allPackageWin,id);
                            }

                        });

                    }
                }
            ]

        };
        me.filterCfg = {
            height: 60,
            header: false,
            //hidden: true,
            defaults: {
                width: 280
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'Name'
                }
                ,{
                    xtype : 'textfield',
                    name : 'excludeIds',
                    hidden : true,
                    isLike: false,
                    value : function(){
                        if(Ext.isEmpty(filterData)){
                            return ;
                        }else{
                            var value = [];
                            for(var i = 0 ; i < filterData.length;i++){
                                value.push( filterData[i].get("id"));
                            }
                            return value.join(",");
                        }
                    }()
                }
            ]
        };
        me.callParent(arguments);
    }
});

/**
 * Created by miao on 2021/6/09.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ValueGrid', {
    extend: "Ext.ux.form.GridField",
    valueSource: 'storeProxy',//从proxy中取值需配置该属性
    recordData:null,
    innerParamsIndex:0,
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.controller.Controller');
        var gridStore=Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.store.ParameterValue',{

        });
        me.gridConfig = {
            renderTo: JSGetUUID(),
            plugins: [],
            tbar: [
//                        '->',
                {
                    xtype:'displayfield',
                    value: i18n.getKey('value'),
                    fieldStyle: 'color:green;font-weight: bold'
                },
                {
                    text: i18n.getKey('add'),
                    itemId: 'add',
                    disabled:true,
                    iconCls: 'icon_add',
                    handler: function (el) {
                        var grid = el.ownerCt.ownerCt;
                        controller.showValueEdit(me, null);
                    }
                }
            ],
            multiSelect: true,
            selType: 'checkboxmodel',
            store: gridStore,
            defaults: {
                width: 60
            },
            columns: [
                {xtype: 'rownumberer'},
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                var index = store.pageSize * (store.currentPage - 1) + rowIndex;
                                controller.showValueEdit(me, record.raw,index);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var index = store.pageSize * (store.currentPage - 1) + rowIndex
                                Ext.Array.splice(store.proxy.data, index, 1);
                                //store.removeAt(rowIndex);
                                store.load();
                                controller.setRecordValueMapping(me,store.proxy.data);
                            }
                        }
                    ]
                },

                {
                    header: i18n.getKey('value'),
                    dataIndex: 'value',
                    width: 100,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var result=value.value||value.calculationExpression;
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
                    }
                },
                {
                    header: i18n.getKey('description'),
                    dataIndex: 'description',
                    flex: 1,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    xtype: 'componentcolumn',
                    header: i18n.getKey('condition'),
                    dataIndex: 'condition',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看condition"';
                        if(Ext.isEmpty(value)){
                            return "";
                        }
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-condition" style="color: blue">查看</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-condition');
                                    clickElement.addEventListener('click', function () {
                                        controller.showCondition(value);
                                    },false);
                                }
                            }
                        }

                    }
                }

            ],
            // bbar: Ext.create('Ext.PagingToolbar', {
            //     store: gridStore,
            //     disabledCls: 'x-tbar-loading',
            //     displayInfo: true, // 是否 ? 示， 分 ? 信息
            //     displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            //
            // })
        };
        me.callParent(arguments);
    },
    reflashData:function (record,index){
        var me=this;
        me.innerParamsIndex=index;
        me.recordData=record.raw;
        me.getGrid().store.proxy.data=[];
        me.setSubmitValue(me.recordData['valueMappings']);
    }
})
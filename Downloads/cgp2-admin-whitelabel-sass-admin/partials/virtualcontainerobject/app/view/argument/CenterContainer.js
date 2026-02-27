Ext.Loader.setPath('CGP.virtualcontainerobject', '../../app');
Ext.define("CGP.virtualcontainerobject.view.argument.CenterContainer", {
    extend: "Ext.tab.Panel",
    region: 'center',
    controller: null,
    createOrEdit: 'create',
    isDirty: false,
    selRecord:null,
    leftTree:null,
    setValue:function (data){

    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.isValid() == false) {
                isValid = false;
                me.setActiveTab(item);
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        return result;
    },
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
        //定义新的事件
        me.addEvents({
            "dirty": true,
            'completeRefreshData': true//配置详情完成刷新
        });
        me.on('dirty', function () {
            this.isDirty = true;

        }, this);
        var valueComp=controller.createValueComp(me.selRecord,me.leftTree);
        me.items = [
            valueComp
            // {
            //     xtype:'gridfieldwithcrud',
            //     itemId:'rtAttriValue',
            //     minHeight: 100,
            //     msgTarget: 'side',
            //     labelAlign: 'top',
            //     allowBlank: false,
            //     padding: '10 25 30 25',
            //     formItems : [
            //         {
            //             name: 'description',
            //             text: i18n.getKey('description'),
            //             itemId: 'description',
            //             xtype: 'textfield',
            //             allowBlank: false,
            //             fieldLabel: i18n.getKey('description')
            //         },
            //
            //         {
            //             xtype: 'conditionfieldcontainer',
            //             name: 'condition',
            //             itemId: 'condition',
            //             maxHeight: 350,
            //             width: 800,
            //             minHeight: 80,
            //             fieldLabel: i18n.getKey('condition'),
            //         }
            //     ],
            //     gridConfig : {
            //         renderTo: JSGetUUID(),
            //         autoScroll: true,
            //         maxHeight: 350,
            //         itemId: 'gridField_grid',
            //         store: Ext.create('Ext.data.Store', {
            //             fields: [
            //                 {
            //                     name: 'condition',
            //                     type: 'object'
            //                 },
            //                 {
            //                     name: 'outputValue',
            //                     type: 'object'
            //                 },
            //                 {
            //                     name: 'description',
            //                     type: 'string'
            //                 }, {
            //                     name: 'clazz',
            //                     type: 'string',
            //                     value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
            //                 }
            //             ],
            //             data: me.data || []
            //         }),
            //         columns: [
            //             {
            //                 xtype: 'rownumberer',
            //                 tdCls: 'vertical-middle',
            //                 width: 60
            //             },
            //             {
            //                 text: i18n.getKey('description'),
            //                 dataIndex: 'description',
            //                 tdCls: 'vertical-middle',
            //                 itemId: 'description',
            //                 width: 260
            //             },
            //             {
            //                 text: i18n.getKey('condition'),
            //                 dataIndex: 'condition',
            //                 tdCls: 'vertical-middle',
            //                 itemId: 'condition',
            //                 width: 150,
            //                 xtype: 'componentcolumn',
            //                 renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
            //                     if (value && value.conditionType == 'else') {
            //                         return {
            //                             xtype: 'displayfield',
            //                             value: '<font color="red">其他条件都不成立时执行</font>'
            //                         };
            //                     } else if (value && (value.operation.operations.length > 0 || value.conditionType == 'custom')) {
            //                         return {
            //                             xtype: 'displayfield',
            //                             value: '<a href="#")>查看执行条件</a>',
            //                             listeners: {
            //                                 render: function (display) {
            //                                     var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
            //                                     var ela = Ext.fly(a); //获取到a元素的element封装对象
            //                                     ela.on("click", function () {
            //                                         controller.checkCondition(value);
            //                                     });
            //                                 }
            //                             }
            //                         };
            //                     } else {
            //                         return {
            //                             xtype: 'displayfield',
            //                             value: '<font color="green">无条件执行</font>'
            //                         };
            //                     }
            //                 }
            //             },
            //             {
            //                 text: i18n.getKey('outputValue'),
            //                 dataIndex: 'outputValue',
            //                 tdCls: 'vertical-middle',
            //                 itemId: 'outputValue',
            //                 flex: 1,
            //                 renderer: function (value, mateData, record) {
            //                     if (!Ext.isEmpty(value.value)) {
            //                         return value.value;
            //                     } else {
            //                         return value.calculationExpression;
            //
            //                     }
            //                 }
            //             }
            //         ]
            //     }
            // }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var centerPanel = btn.ownerCt.ownerCt;
                    if (centerPanel.isValid()) {
                        var data = centerPanel.getValue();
                        centerPanel.el.mask('loading..');
                        var recordId = me.materialMappingDTOConfig ? me.materialMappingDTOConfig._id : null;
                        setTimeout(function () {
                            controller.saveProductMaterialMappingConfig(data, me.createOrEdit, recordId, me);
                        }, 100)
                    }
                }
            }
        ];
        me.callParent();

    }

})

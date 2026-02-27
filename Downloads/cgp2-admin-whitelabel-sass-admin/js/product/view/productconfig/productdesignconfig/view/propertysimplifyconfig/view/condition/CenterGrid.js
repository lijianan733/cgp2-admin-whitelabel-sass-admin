/**
 * Created by nan on 2020/3/26.
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionValueGrid'
])
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.view.condition.CenterGrid", {
    extend: 'CGP.common.condition.view.ConditionValueGrid',
    resourceName: i18n.getKey('condition'),
    contentAttributeStore: null,
    conditionController: null,
    alias: 'widget.centergrid',
    constructor: function () {
        var me = this;
        me.outputValueColumn = {
            text: i18n.getKey('非SKU属性值'),
            dataIndex: 'outputValue',
            tdCls: 'vertical-middle',
            itemId: 'outputValue',
            flex: 1,
            renderer: function (value, mateData, record) {
                //自动换行的div
                console.log(value)
                return JSAutoWordWrapStr(value.value || value.calculationExpression)
            }
        }
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.conditionController = Ext.create('CGP.common.condition.controller.Controller');
        console.log(me.winConfig);
        me.deleteHandler = function (view, rowIndex, colIndex) {
           
            var grid = view.ownerCt;
            var store = view.getStore();
            store.removeAt(rowIndex);
            if (store.proxy.data) {//处理本地数据
                store.proxy.data.splice(rowIndex, 1);
            }
            grid.ownerCt.getComponent('leftGrid').store.load()
        }
        /**
         * 保存时进行特殊处理，
         */
        me.winConfig.saveHandler = function (btn) {
            var form = btn.ownerCt.ownerCt;
            var win = form.ownerCt;
            if (form.isValid()) {
                var data = form.getValue();
                console.log(data);
                //处理初始化的store没配置data字段
                win.outGrid.store.proxy.data ? null : win.outGrid.store.proxy.data = [];
                if (win.createOrEdit == 'create') {
                    win.outGrid.store.proxy.data.push(data);
                } else {
                    win.outGrid.store.proxy.data[win.record.index] = data;
                }
                win.outGrid.store.load();
                win.outGrid.ownerCt.getComponent('leftGrid').store.load()
                win.close();
            }
        };
        console.log(me.winConfig);
        me.callParent();
        me.on('afterrender', function () {
            var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
            toolbar.setDisabled(true);
        })
    },

    refreshData: function (data, record) {
        var me = this;
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        //这里只能手动改winCfg
        if (record) {
            var attributeStore = Ext.data.StoreManager.get('attributeStore');
            var skuAttributeData = attributeStore.findRecord('id', record.getId()).raw;
            toolbar.setDisabled(false);
            me.outputValueComponent = me.conditionController.createFieldByAttribute(skuAttributeData.attribute, null, null, [], 'id');
            me.outputValueComponent.fieldLabel = i18n.getKey('attribute') + i18n.getKey('value');
            me.winConfig.formConfig.items[3] = me.outputValueComponent;
            me.winConfig.formConfig.items[1] = {
                name: 'outputValueType',
                itemId: 'outputValueType',
                xtype: 'hiddenfield',
            };
        } else {
            toolbar.setDisabled(true);
        }
        if (data) {
            me.setReadOnly(false);
            me.store.proxy.data = (data);
            me.store.load();
        } else {
            me.setReadOnly(true);
            me.store.proxy.data = [];
            me.store.load();
        }
    },
})

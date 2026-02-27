/**
 * Created by  on 2021/05/27
 *OrderSingleFillGridMultiplePCPreprocessConfig
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.BaseForm',
    "CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SMVTGridField",
    "CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMappingSet",
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.MVTField'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.OrderSingleFillGridMultiple', {
    extend: 'Ext.form.Panel',
    // alias: 'widget.calenderdetailconfigform',
    isValidForItems: true,
    autoScroll: true,
    layout: {
        type: 'vbox',
    },
    defaults: {
        allowBlank: true,
        msgTarget: 'side',
        width: 600,
        labelWidth: 120,
        labelAlign: 'right',
        margin: '5 25 5 25'
    },

    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.designId)) {
            me.designId = JSGetQueryString('designId');
        }
        var rightmvtStore = Ext.data.StoreManager.lookup('rightmvtStore');
        var leftmvtStore = Ext.data.StoreManager.lookup('leftmvtStore');
        me.items = [
            {
                xtype: 'simplifybase',
                itemId: 'baseField'
            },
            {
                name: 'left',
                xtype: 'mvtfield',
                fieldLabel: i18n.getKey('leftMVT'),
                itemId: 'left',
                allowBlank: false,
                designId: me.designId
            },
            {
                name: 'right',
                xtype: 'mvtfield',
                fieldLabel: i18n.getKey('rightMVT'),
                itemId: 'right',
                allowBlank: false,
                designId: me.designId,
                diyGetValue:function (){
                    var myComp=this;
                    var values=myComp.getValue();
                    var realValue=null;
                    for (var v of values){
                        realValue=v;
                    }
                    return realValue;
                }
            },
            {
                name: 'selectorMappingRelations',
                xtype: 'selectormappingset',
                title: i18n.getKey('selectorMappingRelations'),
                itemId: 'selectorMappingRelations',
                width: 600
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var items = me.items.items, result = {clazz: 'com.qpp.cgp.domain.preprocess.config.tile.OrderSingleFillGridMultiplePCPreprocessConfig'};
        if (me.rendered == true) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.name) {
                    if (item.diyGetValue) {
                        result[item.name] = item.diyGetValue();
                    } else {
                        result[item.name] = Ext.Array.contains(['mvtgridfield', 'selectormapping', 'mvtcombo'], item.xtype) ? item.getSubmitValue() : item.getValue();
                    }
                } else {
                    Ext.Object.merge(result, item.getValue());
                }
            }
            return result;
        } else {
            return me.rawData;
        }
    },
    setValue: function (data) {
        var me = this, items = me.items.items;
        me.rawData = Ext.clone(data);

        if (me.rendered == true) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.name) {
                    if (item.diySetValue) {
                        item.diySetValue(data[item.name]);
                    } else {
                        Ext.Array.contains(['mvtgridfield', 'selectormapping', 'mvtcombo'], item.xtype) ? item.setSubmitValue(data[item.name]) : item.setValue(data[item.name])
                    }
                } else {
                    item.setValue(data);
                }
            }
        } else {
            me.on('afterrender', function () {
                me.setValue(me.rawData);
            })
        }
    }
})

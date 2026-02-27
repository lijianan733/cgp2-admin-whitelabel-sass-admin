/**
 * Created by miao on 2021/05/27
 *CycleFillGridPreprocessConfig
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.BaseForm',
    "CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SMVTGridField",
    "CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMapping",
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.MVTField',
    'CGP.common.expressionfield.ExpNumberField'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.CycleFillGrid', {
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
        me.items = [
            {
                xtype: 'simplifybase',
                itemId: 'baseField'
            },
            {
                name: 'left',
                xtype: 'mvtgridfield',
                fieldLabel: i18n.getKey('leftMVT'),
                itemId: 'left',
                allowBlank: false,
                width: 820
            },
            {
                name: 'right',
                xtype: 'mvtfield',
                fieldLabel: i18n.getKey('rightMVT'),
                itemId: 'right',
                allowBlank: false,
                designId: me.designId,
            },
            {
                name: 'cycleNumber',
                xtype: 'expnumber',
                fieldLabel: i18n.getKey('cycleNumber'),
                itemId: 'cycleNumber',
                allowBlank: false,
                hideTrigger: true
            },
            // {
            //     xtype: 'valueexfield',
            //     fieldLabel: i18n.getKey('cycleNumber'),
            //     name: 'cycleNumber',
            //     allowBlank: false,
            //     itemId: 'cycleNumber',
            //     value: 1,
            //     commonPartFieldConfig: {
            //         defaultValueConfig: {
            //             type: 'Number',
            //             clazz: 'com.qpp.cgp.value.ExpressionValueEx',
            //             typeSetReadOnly: true,
            //             clazzSetReadOnly: true
            //         }
            //     }
            // },
            {
                name: 'selectorMappingRelations',
                xtype: 'selectormapping',
                fieldLabel: i18n.getKey('selectorMappingRelations'),
                itemId: 'selectorMappingRelations',
                allowBlank: false,
                width: 820
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var items = me.items.items,
            result = {clazz: 'com.qpp.cgp.domain.preprocess.config.tile.CycleFillGridPreprocessConfig'};
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

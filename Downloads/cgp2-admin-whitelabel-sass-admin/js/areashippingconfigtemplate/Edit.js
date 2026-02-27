/***
 *Created by shirley on 2021/8/25
 *
 *  */
Ext.Loader.syncRequire([
    'CGP.areashippingconfigtemplate.model.AreaShippingConfigTemplateModel',
    'CGP.areashippingconfigtemplate.store.CountriesStore',
    'CGP.shippingquotationtemplatemanage.view.QtyRuleShippingConfig',
    'CGP.shippingquotationtemplatemanage.view.AreaRuleShippingConfig'
])
Ext.onReady(function () {
    // TODO
    var countriesData = Ext.create('CGP.shippingquotationtemplatemanage.store.CountriesStore');
    var page = Ext.widget({
        block: 'areashippingconfigtemplate',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        tbarCfg: {
            //隐藏无用按钮
            sepEdit: {
                hidden: true
            },
            sepData: {
                hidden: true
            },
            btnCreate: {
                hidden: true
            },
            btnCopy: {
                hidden: true
            },
            btnGrid: {
                hidden: true
            },
            btnConfig: {
                hidden: true
            },
            btnReset: {
                hidden: true
            }
        },
        formCfg: {
            model: 'CGP.areashippingconfigtemplate.model.AreaShippingConfigTemplateModel',
            remoteCfg: false,
            columnCount: 1,
            useForEach: true,
            items: [
                {
                    name: 'areaQtyShippingConfigs',
                    fieldLabel: i18n.getKey('areaQtyShippingConfigs'),
                    xtype: 'qtyruleshippingconfig',
                    itemId: 'areaQtyShippingConfigs',
                    width: 770,
                    allowBlank: false
                },
                {
                    name: 'areas',
                    //TODO 添加多语言配置
                    fieldLabel: i18n.getKey('country'),
                    itemId: 'areas',
                    xtype: 'arearuleshippingconfig',
                    width: 770,
                    allowBlank: false,
                    diySetValue: function (data) {
                        if (!Ext.isEmpty(data)) {
                            var me = this;
                            me.setSubmitValue(data);
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.getSubmitValue();
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'clazz',
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfigTemplate',
                    hidden: true
                }
            ]
        },
        listeners: {
            'afterload': function (page) {

            }
        }
    });
});
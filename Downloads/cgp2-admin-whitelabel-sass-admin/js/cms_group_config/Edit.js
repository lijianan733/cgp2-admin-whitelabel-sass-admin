/**
 * @Description
 * @author nan
 * @date 2025/8/1
 */
Ext.Loader.syncRequire([
    'CGP.cms_group_config.model.CmsGroupConfigModel',
    'CGP.cmsformcomponentrendertemplate.view.CmsFormComponentRenderTemplateGridCombo'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.cmsformcomponentrendertemplate.store.CmsFormComponentRenderTemplateStore', {});
    var page = Ext.widget({
        xtype: 'uxeditpage',
        block: 'cms_group_config',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.cms_group_config.model.CmsGroupConfigModel',
            layout: 'vbox',
            fieldDefaults: {
                allowBlank: false,
                width: 450,
            },
            items: [
                {
                    xtype: 'combo',
                    name: 'clazz',
                    itemId: 'clazz',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    titleField: 'title',
                    fieldLabel: i18n.getKey('type'),
                    value: 'com.qpp.cgp.domain.cms.Panel',
                    store: {
                        xtype: 'store',
                        fields: ['display', 'value', 'title'],
                        data: [
                            {
                                'display': 'CustomizeGroup',
                                title: 'CustomizeGroup',
                                'value': 'com.qpp.cgp.domain.cms.CustomizeGroup'
                            },
                            {
                                'display': 'Grid',
                                title: 'Grid',
                                'value': 'com.qpp.cgp.domain.cms.Grid'
                            },
                            {
                                'display': 'Panel',
                                title: 'Panel',
                                'value': 'com.qpp.cgp.domain.cms.Panel'
                            }
                        ]
                    },
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var orientation = field.ownerCt.getComponent('orientation');
                            var fixedRow = field.ownerCt.getComponent('fixedRow');
                            var number = field.ownerCt.getComponent('number');
                            var template = field.ownerCt.getComponent('template');
                            orientation.setVisible(newValue == 'com.qpp.cgp.domain.cms.Panel');
                            orientation.setDisabled(newValue != 'com.qpp.cgp.domain.cms.Panel');
                            fixedRow.setVisible(newValue == 'com.qpp.cgp.domain.cms.Grid');
                            fixedRow.setDisabled(newValue != 'com.qpp.cgp.domain.cms.Grid');
                            number.setVisible(newValue == 'com.qpp.cgp.domain.cms.Grid');
                            number.setDisabled(newValue != 'com.qpp.cgp.domain.cms.Grid');
                            template.setVisible(newValue == 'com.qpp.cgp.domain.cms.CustomizeGroup');
                            template.setDisabled(newValue != 'com.qpp.cgp.domain.cms.CustomizeGroup');
                        }
                    }
                },
                {
                    xtype: 'hiddenfield',
                    name: '_id',
                    itemId: '_id',
                },
                {
                    xtype: 'textarea',
                    itemId: 'description',
                    name: 'description',
                    minHeight: 80,
                    fieldLabel: i18n.getKey('description')
                },
                {
                    xtype: 'numberfield',
                    itemId: 'border',
                    name: 'border',
                    minValue: 0,
                    maxValue: 100,
                    step: 1,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('组件边框大小')
                },
                {
                    xtype: 'combo',
                    name: 'attributeSchemaVersion',
                    itemId: 'attributeSchemaVersion',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    titleField: 'title',
                    fieldLabel: i18n.getKey('组件兼容表单类型'),
                    store: {
                        xtype: 'store',
                        fields: ['display', 'value', 'title'],
                        data: [
                            {
                                'display': 'Profile结构表单',
                                title: 'Profile结构表单',
                                'value': 'v1'
                            },
                            {
                                'display': 'Group结构表单',
                                title: 'Group结构表单',
                                'value': 'v2'
                            },
                        ]
                    }
                },
                {
                    xtype: 'combo',
                    itemId: 'orientation',
                    name: 'orientation',
                    fieldLabel: i18n.getKey('排布方向'),
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['display', 'value'],
                        data: [
                            {
                                'display': '横向排布(行)',
                                'value': 'Horizontal'
                            },
                            {
                                'display': '垂直排布(列)',
                                'value': 'Vertical'
                            },
                        ]
                    }
                },
                {
                    xtype: 'combo',
                    itemId: 'fixedRow',
                    name: 'fixedRow',
                    fieldLabel: i18n.getKey('排布方向'),
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    hidden: true,
                    disabled: true,
                    store: {
                        xtype: 'store',
                        fields: ['display', 'value'],
                        data: [
                            {
                                'display': '横向排布(行)',
                                'value': true
                            },
                            {
                                'display': '垂直排布(列)',
                                'value': false
                            },
                        ]
                    }
                },
                {
                    xtype: 'numberfield',
                    itemId: 'number',
                    name: 'number',
                    minValue: 0,
                    step: 1,
                    hidden: true,
                    disabled: true,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('排布的行或列数量')
                },
                {

                    xtype: 'cms_form_component_render_template_gridcombo',
                    itemId: 'template',
                    name: 'template',
                    valueType: 'idReference',
                    hidden: true,
                    disabled: true,
                    fieldLabel: i18n.getKey('模板'),
                },
            ]
        }
    })
})

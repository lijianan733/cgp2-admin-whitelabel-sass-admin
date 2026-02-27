/**
 * @Description
 * @author nan
 * @date 2025/8/1
 */
Ext.Loader.syncRequire([
    'CGP.cms_group_config.store.CmsGroupConfigStore'
]);
Ext.onReady(function () {
    var cmsContextStore = Ext.create('CGP.cms_group_config.store.CmsGroupConfigStore');
    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('Group组件样式配置'),
        block: 'cms_group_config',
        editPage: 'edit.html',
        filterCfg: {
            defaults: {
                isLike: false
            },
            layout: {
                type: 'table',
                columns: 3,
            },
            items: [
                {
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    name: '_id'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description',
                    name: 'description'
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
                    name: 'clazz',
                    itemId: 'clazz',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    fieldLabel: i18n.getKey('type'),
                    store: {
                        xtype: 'store',
                        fields: ['display', 'value'],
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
                    }
                }]
        },
        gridCfg: {
            store: cmsContextStore,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id'
                },
                {
                    xtype: 'auto_bread_word_column',
                    width: 250,
                    text: i18n.getKey('描述'),
                    dataIndex: 'description',
                },
                {
                    text: i18n.getKey('边框大小'),
                    dataIndex: 'border',
                },
                {
                    text: i18n.getKey('组件兼容表单类型'),
                    dataIndex: 'attributeSchemaVersion',
                    width: 180,
                    renderer: function (value, metaData, record) {
                        return value == 'v1' ? '<font color="green">Profile结构表单</font>' : '<font color="red">Group结构表单</font>';
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: '组件信息',
                    dataIndex: 'clazz',
                    flex: 1,
                    getDisplayName: function (value, metaData, record) {
                        var item = [];
                        var data = value.split('.').pop();
                        item = [{
                            title: '类型',
                            value: data
                        }];
                        if (value == 'com.qpp.cgp.domain.cms.CustomizeGroup') {
                            var template = record.get('template');
                            item.push({
                                title: '组件模板',
                                value: `<a class="atag_display">${template.code}</a>`
                            });
                        } else if (value == 'com.qpp.cgp.domain.cms.Grid') {
                            var fixedRow = record.get('fixedRow');
                            var number = record.get('number');
                            item.push({
                                title: '排布方向',
                                value: fixedRow == true ? '横向排布(行)' : '垂直排布(列)'
                            });
                            item.push({
                                title: '排布的行或列数量',
                                value: number
                            });
                        } else if (value == 'com.qpp.cgp.domain.cms.Panel') {
                            var orientation = record.get('orientation');
                            item.push({
                                title: '排布方向',
                                value: orientation == 'Horizontal' ? '横向排布(行)' : '垂直排布(列)'
                            });
                        }
                        return JSCreateHTMLTable(item);
                    },
                    clickHandler: function (value, metaData, record) {
                        var template = record.get('template');
                        JSOpen({
                            id: 'cmsformcomponentrendertemplatepage',
                            url: path + 'partials/cmsformcomponentrendertemplate/main.html?code=' + template.code,
                            title: i18n.getKey('表单组件渲染模板'),
                            refresh: true
                        });
                    }
                }
            ]
        }
    })
})
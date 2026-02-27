/**
 * Created by nan on 2018/8/10.
 */
Ext.syncRequire([
    'CGP.useableauthoritymanage.store.UseableAuthorityManageStore',
    'CGP.useableauthoritymanage.model.UseableAuthorityManageModel'
]);
Ext.onReady(function () {
    var store = Ext.create('CGP.authorityeffectrange.store.AuthorityEffectRangeStore', {
    });
    var controller = Ext.create('CGP.authorityeffectrange.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('authorityEffectRange'),
        block: 'authorityeffectrange',
        editPage: 'edit.html',
        //权限控制
        tbarCfg: {

            hiddenButtons: [],//按钮的名称
            disabledButtons: []//按钮的名称
        },
        gridCfg: {
            store: store,
            frame: false,
            editAction: true,//是否启用edit的按钮
            deleteAction: true,//是否启用delete的按钮
            columnDefaults: {
                width: 200
            },
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                    width: 100
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name')
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description')
                },

                {
                    dataIndex: 'permissionType',
                    text: i18n.getKey('type'),
                    width: 100
                },
                {
                    dataIndex: 'effectiveTime',
                    text: i18n.getKey('enabledDate'),
                    renderer: function (value, metadata, record) {
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    dataIndex: 'expireTime',
                    text: i18n.getKey('expireTime'),
                    renderer: function (value, metadata, record) {
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    dataIndex: 'privilegeDTO',
                    xtype: 'componentcolumn',
                    text: i18n.getKey('permission'),
                    renderer: function (value, metadata, record) {
                        if (!value) {
                            return null
                        }
                        metadata.tdAttr = 'data-qtip=' + value.name + '(' + value._id + ')';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + value.name + "(" + value._id + ')</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSOpen({
                                            id: 'useableauthoritymanagepage',
                                            url: path + "partials/useableauthoritymanage/main.html?id=" + value._id,
                                            title: i18n.getKey('useableAuthority'),
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        };
                    }
                },
                {
                    dataIndex: 'scope',
                    width: 300,
                    text: i18n.getKey('rules'),
                    renderer: function (value, metadata, record) {
                        var expression = controller.toExpression(value.astNode);
                        metadata.tdAttr = 'data-qtip="' + expression + '"';
                        return '<div style="white-space:normal;">' + expression + '</div>';
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    itemId: '_id',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false
                },
                {
                    itemId: 'name',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name')
                },
                {
                    itemId: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description')
                },
                {
                    itemId: 'permissionType',
                    name: 'permissionType',
                    xtype: 'combo',
                    editable: false,
                    displayField: 'type',
                    valueField: 'value',
                    fieldLabel: i18n.getKey('type'),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'type', type: 'string'
                            },
                            {
                                name: 'value', type: 'string'
                            }
                        ],
                        data: [
                            {
                                type: 'PERMIT',
                                value: 'PERMIT'
                            },
                            {
                                type: 'FORBID',
                                value: 'FORBID'
                            }
                        ]
                    })

                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'effectiveTime',
                    xtype: 'datefield',
                    itemId: 'effectiveTime',
                    scope: true,
                    editable: false,
                    fieldLabel: i18n.getKey('enabledDate'),
                    width: 360,
                    format: 'Y/m/d'
                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'expireTime',
                    xtype: 'datefield',
                    itemId: 'expireTime',
                    scope: true,
                    editable: false,
                    fieldLabel: i18n.getKey('expireTime'),
                    width: 360,
                    format: 'Y/m/d'
                },
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    value: 'com.qpp.security.domain.acp.AccessControlPermission',
                    hidden: true
                },
                {
                    name: 'privilege._id',
                    xtype: 'textfield',
                    itemId: 'permission',
                    fieldLabel: i18n.getKey('permission'),
                    isLike: false
                }
            ]
        }
    });
});
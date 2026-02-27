/**
 * Created by nan on 2018/8/16.
 */
Ext.syncRequire([
    'CGP.acprole.store.AcpRoleStore',
    'CGP.acprole.model.AcpRoleModel',
    'CGP.authorityeffectrange.store.AuthorityEffectRangeStore',
    'CGP.acprole.view.SelectAcpRoleWin'
]);
Ext.onReady(function () {
    var store = Ext.create('CGP.acprole.store.AcpRoleStore', { });
    var controller = Ext.create('CGP.acprole.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('acpRole'),
        block: 'acprole',
        editPage: 'edit.html',
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
                    text: i18n.getKey('operator'),
                    sortable: false,
                    itemId: 'operator',
                    width: 125,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('authorityEffectRange') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.setAcpWindow(record.get('abstractACPDTOS'));
                                    });
                                }
                            }
                        };
                    }
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name')
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description')
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
                    name: 'clazz',
                    xtype: 'textfield',
                    isLike: false,
                    value: 'com.qpp.security.domain.acp.Role',
                    hidden: true
                }
            ]
        }
    });
    window.openPanel = function (id) {
        JSOpen({
            id: 'authorityeffectrangepage',
            title: i18n.getKey('effectRange'),
            url: path + 'partials/authorityeffectrange/main.html?_id=' + id,
            refresh: true
        })
    }
})

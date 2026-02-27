/**
 * Created by admin on 2019/4/10.
 */

Ext.onReady(function () {
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var controller = Ext.create('CGP.dspagetemplateconfig.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('dspagetemplateconfig'),
        block: 'dspagetemplateconfig',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: Ext.create("CGP.dspagetemplateconfig.store.Dspagetemplateconfig"),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },

            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('pageType'),
                    dataIndex: 'pageType',
                    xtype: 'gridcolumn',
                    width: 200,
                    itemId: 'pageType',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('dataSourceId'),
                    dataIndex: 'dataSourceId',
                    xtype: 'componentcolumn',
                    itemId: 'dataSourceId',
                    sortable: false,
                    width: 200,

                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看dataSource"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-dataSource" style="color: blue;text-decoration: none">' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-dataSource');
                                    clickElement.addEventListener('click', function () {
                                        JSOpen({
                                            id: 'dataSourcepepage',
                                            url: path + 'partials/dsdatasource/main.html?dataSourceId=' + value,
                                            title: i18n.getKey('dataSource'),
                                            refresh: true
                                        })
                                    }, false);

                                }
                            }
                        }
                    }

                },
                {
                    text: i18n.getKey('templateFileName'),
                    dataIndex: 'templateFileName',
                    xtype: 'gridcolumn',
                    width: 200,
                    itemId: 'templateFileName',
                    sortable: true
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'description',
                    sortable: true,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'numberfield',
                    listeners: {
                        render: function (comp) {
                            var pageTemplateId = getQueryString('pageTemplateId');
                            if (pageTemplateId) {
                                comp.setValue(pageTemplateId);
                            }
                        }
                    },
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'code',
                    name: 'pageType',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('pageType'),
                    itemId: 'pageType'
                }
            ]
        }

    });
});
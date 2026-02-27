/**
 * Created by nan on 2021/1/19
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.view.ExtraInfoColumn', {
    extend: 'Skirtle.grid.column.Component',
    alias: 'widget.sourcedataextrainfocolumn',
    minWidth: 250,
    productId: null,
    designId: null,
    productBomConfigId: null,
    renderer: function (value, metadata, record) {
        if (value == 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig') {
            return {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                },
                defaults: {
                    labelWidth: 150,
                    width: '100%'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('mvtType'),
                        value: record.get('mvtType')
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('materialViewTypeId'),
                        value: '<a href="#")>' + record.get('materialViewTypeId') + '</a>',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                ela.on("click", function () {
                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                                    var productId = JSGetQueryString('productId');
                                    var designId = JSGetQueryString('designId');
                                    var productBomConfigId = JSGetQueryString('productBomConfigId');
                                    var pmvtId = record.get('materialViewTypeId');
                                    var type = record.get('mvtType');
                                    if (type == 'productMaterialViewType') {
                                        builderConfigTab.editProductMaterialViewType(pmvtId, productId, designId, productBomConfigId,);
                                    } else {
                                        builderConfigTab.editSimplifyBomConfig(designId, productBomConfigId, pmvtId);
                                    }
                                });
                            }
                        }
                    }
                ]
            }
        } else if (value == 'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig') {
            return {
                xtype: 'displayfield',
                labelWidth: 150,
                fieldLabel: i18n.getKey('rtTypeId'),
                value: '<a href="#")>' + record.get('rtTypeId') + '</a>',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        ela.on("click", function () {
                            var rtTypeId = record.get('rtTypeId');
                            JSOpen({
                                id: 'rttypespage',
                                url: path + "partials/rttypes/rttype.html?rtType=" + rtTypeId,
                                title: 'RtType',
                                refresh: true
                            })
                        });
                    }
                }
            }
        } else if (value == 'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig') {
            var data = [];
            data.push({
                title: 'productMaterialViewTypeTemplateConfigId',
                value: record.get('productMaterialViewTypeTemplateConfigId')
            })
            return JSCreateHTMLTable(data);
        } else if (value == 'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig') {
            var pageContents = record.get('pageContents');
            var items = [
                {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('pageContents'),
                    rowspan: pageContents.length
                },
            ];
            for (var i = 0; i < pageContents.length; i++) {
                items.push({
                    xtype: 'displayfield',
                    value: pageContents[i].name + '(<a href="#")>' + pageContents[i]._id + '</a>)',
                    pageContentId: pageContents[i]._id,
                    listeners: {
                        render: function (display) {
                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                            var pageContentsId = display.pageContentId;
                            ela.on("click", function () {
                                // http://localhost:8080/cgp2-admin-fixbug/partials/pagecontent/main.html"
                                    JSOpen({
                                        id: 'pagecontentpage',
                                        url: path + "partials/pagecontent/main.html?_id=" + pageContentsId,
                                        title: 'pageContent',
                                        refresh: true
                                    })
                            });
                        }
                    }
                })
            }
            return {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'table',
                    columns: 2
                },
                defaults: {
                    labelWidth: 150,
                    width: '100%'
                },
                items: items
            }
        }
    }
})

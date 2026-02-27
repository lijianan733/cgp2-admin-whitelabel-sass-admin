/**
 * @Description:
 * @author nan
 * @date 2022/5/11
 */
Ext.define('CGP.cmslog.view.DetailGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.detailgrid',
    width: '100%',
    itemId: 'grid',
    autoScroll: true,
    targetEnv: null,//发布的目标环境qpmn或者qpson
    resultStatus: null,//发布的最终状态，200表示发布完成
    websiteUrl: '',//正式网站所在网站地址
    stageUrl: '',//测试网站所在地址
    websiteConfig: null,//发布时，选择的网站配置
    cmslogData: null,
    getJointUrl: function (url, pageName, pageType) {
        const baseUrl = new URL(url);

        // 处理现有路径，保持原有路径并拼接新的路径
        const currentPath = baseUrl.pathname.endsWith('/') ? baseUrl.pathname.slice(0, -1) : baseUrl.pathname;

        // 更新 pathname
        baseUrl.pathname = [currentPath, pageType, pageName].filter(Boolean).join('/');

        return baseUrl.toString();
    },
    viewConfig: {
        listeners: {
            expandbody: function (tr, obj, selector, event) {
                console.log('expandbody');
                var grid = this.ownerCt;
                var raw = obj.raw;
                var dom = document.getElementById('log-' + raw._id);
                var cmsDetailLogId = raw.cmsDetailLogId;
                if (Ext.isEmpty(dom.innerHTML)) {
                    var form = Ext.create('Ext.form.Panel', {
                        renderTo: 'log-' + raw._id,
                        autoScroll: true,
                        layout: {
                            type: 'column'
                        },
                        minHeight: 100,
                        bodyStyle: {
                            borderColor: 'silver'
                        },
                        margin: '0 50 10 0',
                        defaults: {
                            labelWidth: 120,
                            margin: '5 25'
                        },
                        listeners: {
                            el: {
                                dblclick: function (event) {
                                    event.stopEvent();
                                    console.log('elDblclick')
                                }
                            },
                            afterrender: function () {
                                grid.doLayout();
                            }
                        },
                    });
                    if (form.items.length == 0) {
                        grid.setLoading(true);
                        var url = cmsPagePath + 'api/cms-saas-log/logs/v2';
                        JSAjaxRequest(url, 'POST', true, [cmsDetailLogId], false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    var cmsDetailLog = responseText.data[cmsDetailLogId] || {};
                                    var items = [
                                        {
                                            xtype: 'displayfield',
                                            hidden: Ext.isEmpty(cmsDetailLog.sourceDir),
                                            value: JSAutoWordWrapStr(cmsDetailLog.sourceDir),
                                            fieldLabel: '项目目录'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            hidden: Ext.isEmpty(cmsDetailLog.templateFileName),
                                            value: JSAutoWordWrapStr(cmsDetailLog.templateFileName),
                                            fieldLabel: '模板文件路径'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            hidden: Ext.isEmpty(cmsDetailLog.targetDir),
                                            value: JSAutoWordWrapStr(cmsDetailLog.targetDir),
                                            fieldLabel: '输出文件目录'

                                        },
                                        {
                                            xtype: 'displayfield',
                                            hidden: Ext.isEmpty(cmsDetailLog.targetFilePath),
                                            value: JSAutoWordWrapStr(cmsDetailLog.targetFilePath),
                                            fieldLabel: '输出文件文件路径'
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            fieldLabel: '模板文件内容',
                                            value: '查看',
                                            hidden: Ext.isEmpty(cmsDetailLog.template),
                                            clickHandler: function (value, metaData, record) {
                                                var template = cmsDetailLog.template;
                                                JSShowJsonData(template, '模板文件内容');

                                            },
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            fieldLabel: '输出文件内容',
                                            value: '查看',
                                            hidden: Ext.Object.isEmpty(cmsDetailLog.content),
                                            clickHandler: function (value, metaData, record) {
                                                var content = cmsDetailLog.content;
                                                JSShowJsonData(content, '输出文件内容');
                                            }
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            fieldLabel: 'initVariables',
                                            value: '查看',
                                            hidden: Ext.Object.isEmpty(cmsDetailLog.initVariables),
                                            clickHandler: function (value, metaData, record) {
                                                var initVariables = cmsDetailLog.initVariables;
                                                JSShowJsonDataV2(initVariables, 'initVariables');
                                            }
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            fieldLabel: 'paramsContext',
                                            value: '查看',
                                            hidden: Ext.Object.isEmpty(cmsDetailLog.paramsContext),
                                            clickHandler: function (value, metaData, record) {
                                                var paramsContext = cmsDetailLog.paramsContext;
                                                JSShowJsonDataV2(paramsContext, 'paramsContext');
                                            }
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            fieldLabel: 'freemarkerContext',
                                            value: '查看',
                                            hidden: Ext.Object.isEmpty(cmsDetailLog.freemarkerContext),
                                            clickHandler: function (value, metaData, record) {
                                                var freemarkerContext = cmsDetailLog.freemarkerContext;
                                                JSShowJsonDataV2(freemarkerContext, 'freemarkerContext');
                                            }
                                        },
                                    ];
                                    form.add(items);
                                    form.doLayout();
                                }
                                setTimeout(function () {
                                    grid.doLayout();
                                }, 250)
                            }
                            grid.setLoading(false);
                        },);
                    }
                }
            },
            collapsebody: function (tr, obj, selector, event) {
                console.log('collapsebody');
            }
        },
    },
    columns: [
        {
            xtype: 'rownumberer',
            tdCls: 'vertical-middle',
        },
        {
            text: i18n.getKey('发布内容'),
            dataIndex: 'cmsType',
            xtype: 'atagcolumn',
            flex: 1,
            getDisplayName: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var cmsConfig = record.get('cmsConfig');
                var displayInfo = [];
                if (cmsConfig.clazz == 'com.qpp.cgp.domain.cms.ProductDetailCMSConfig') {
                    var productListDTO = cmsConfig['productListDTO'];
                    displayInfo = [
                        {
                            title: i18n.getKey('type'),
                            value: i18n.getKey(value)
                        }, {
                            title: '产品编号',
                            value: productListDTO.id
                        },
                        {
                            title: i18n.getKey('productMode'),
                            value: productListDTO.mode
                        },
                        {
                            title: i18n.getKey('name'),
                            value: productListDTO.name
                        }
                    ];
                    displayInfo = JSCreateHTMLTable(displayInfo);
                } else if (cmsConfig.clazz == 'com.qpp.cgp.domain.cms.ProductsOfCatalogCMSConfig') {
                    var category = cmsConfig['category'];
                    displayInfo = [
                        {
                            title: i18n.getKey('类目编号'),
                            value: category.id
                        },
                        {
                            title: i18n.getKey('name'),
                            value: category.name
                        }, {
                            title: i18n.getKey('type'),
                            value: value.showAsProductCatalog ? '营销类目' : '产品类目'
                        },
                    ];
                    displayInfo = JSCreateHTMLTable(displayInfo);
                } else if (cmsConfig.clazz == 'com.qpp.cgp.domain.cms.NormalPageCMSConfig') {
                    displayInfo = '<font color="green">普通页</font>';
                }
                return (displayInfo);
            },
        },
        {
            text: i18n.getKey('发布配置'),
            dataIndex: 'source',
            xtype: 'componentcolumn',
            flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var cmsConfig = record.get('cmsConfig');
                var displayInfo = [];
                var title = null;
                var type = null;
                displayInfo = [
                    {
                        title: '发布配置编号',
                        value: '<a href="#" style="color: blue;">' + cmsConfig._id + '</a>'
                    },
                    {
                        title: '发布页面名称',
                        value: cmsConfig.pageName
                    },
                    {
                        title: 'CMSPage编号',
                        value: '<a href="#" style="color: blue;">' + cmsConfig.cmsPageId + '</a>'
                    },
                ];
                if (cmsConfig.clazz == 'com.qpp.cgp.domain.cms.ProductDetailCMSConfig') {
                    title = i18n.getKey('productPublishConfig');
                    type = 'ProductDetail';
                } else if (cmsConfig.clazz == 'com.qpp.cgp.domain.cms.ProductsOfCatalogCMSConfig') {
                    title = i18n.getKey('categoryPublishConfig');
                    type = 'ProductCategory';
                } else if (cmsConfig.clazz == 'com.qpp.cgp.domain.cms.NormalPageCMSConfig') {
                    title = i18n.getKey('普通页发布配置');
                    type = 'NormalPage';
                }
                if (cmsConfig) {
                    var cmsConfigId = cmsConfig._id;
                    var cmsPageId = cmsConfig.cmsPageId;
                    return {
                        xtype: 'displayfield',
                        value: JSCreateHTMLTable(displayInfo),
                        listeners: {
                            render: function (display) {
                                var a1 = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                var a2 = display.el.dom.getElementsByTagName('a')[1]; //获取到该html元素下的a元素
                                if (a1) {
                                    var ela = Ext.fly(a1); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSOpen({
                                            id: 'cmsconfigpage2',
                                            url: path + "partials/cmsconfig/main.html?_id=" + cmsConfigId + '&type=' + type,
                                            title: title,
                                            refresh: true
                                        })
                                    });
                                }
                                if (a2) {
                                    var ela2 = Ext.fly(a2); //获取到a元素的element封装对象
                                    ela2.on("click", function () {
                                        JSOpen({
                                            id: 'cmspagespage',
                                            url: path + 'partials/cmspages/main.html?_id=' + cmsPageId,
                                            title: i18n.getKey('CMSPages'),
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        }
                    };
                }
            }
        },
        {
            text: i18n.getKey('status'),
            dataIndex: 'status',
            width: 250,
            flex: 1,
            xtype: 'componentcolumn',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var str = '';
                var cmsConfig = record.raw.cmsConfig;
                var detailGrid = view.ownerCt;
                var type = cmsConfig.clazz;
                var pageName = cmsConfig.pageName;
                var message = record.get('message');
                var resultStatus = detailGrid.resultStatus;
                var websiteUrl = detailGrid.websiteUrl;
                var stageUrl = detailGrid.stageUrl || (detailGrid.websiteUrl + '/stage');
                var targetEnv = detailGrid.targetEnv;
                var websiteConfig = detailGrid.websiteConfig;
                pageName = pageName.split('.');
                pageName.pop();
                pageName = pageName.join('.');
                pageName = pageName.replace('.ejs', '.html');
                str = '<font color="green">CMS发布页生成成功</font>';
                //这里的value指的是子任务的状态，需要拿外部整个发布流程的status来进行判断
                if (value == 200 && resultStatus == 200) {
                    str += '     <a href="#" style="color: blue;">' + i18n.getKey('check') + i18n.getKey('page') + '</a>';
                } else if (Ext.Array.contains([0, 3, 5, 7], value)) {
                    str = '<font color="red">CMS发布页生成失败</font>';
                    str += '     <a href="#" style="color: blue">' + i18n.getKey('check') + i18n.getKey('errorDetail') + '</a>';
                }
                return {
                    xtype: 'displayfield',
                    value: str,
                    listeners: {
                        render: function (display) {
                            var productDetailTpl = new Ext.XTemplate('{websiteUrl}/{pageType}/{pageName}');
                            var pageType = '';
                            if (type == "com.qpp.cgp.domain.cms.ProductsOfCatalogCMSConfig") {     //產品類目
                                pageType = 'catalog';
                                //实际上没有查看类目页的跳转
                            } else if (type == "com.qpp.cgp.domain.cms.ProductDetailCMSConfig") {     //產品詳情
                                if (targetEnv == 'QPSON') {
                                    pageType = 'products';
                                } else if (targetEnv == 'QPMN' || targetEnv == 'QPMN-CN' || targetEnv == 'POP-PRINT') {
                                    pageType = 'app/products';
                                }
                            } else if (type == "com.qpp.cgp.domain.cms.NormalPageCMSConfig") {     //普通頁
                                pageType = '';
                                if (targetEnv == 'QPSON') {
                                    pageName = 'customize/new-products/all';
                                } else if (targetEnv == 'QPMN' || targetEnv == 'QPMN-CN' || targetEnv == 'POP-PRINT') {
                                    pageName = 'app/customize/new-products/all';
                                }
                            }
                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                            var status = value;
                            if (ela) {
                                if (status == 200) {
                                    ela.on("click", function () {
                                        var builderUrl = '';
                                        //如果是云上可以选择查看是stage release
                                        if (JSWebsiteIsTest()) {     //70 73
                                            /*builderUrl = productDetailTpl.apply({
                                                websiteUrl: websiteUrl,
                                                pageType: pageType,
                                                pageName: pageName
                                            });*/
                                            builderUrl = detailGrid.getJointUrl(websiteUrl, pageName, pageType);
                                            window.open(builderUrl);
                                        } else {
                                            //云上
                                            /* var stageBuilderUrl = productDetailTpl.apply({
                                                 websiteUrl: stageUrl,
                                                 pageType: pageType,
                                                 pageName: pageName
                                             });*/

                                            /* builderUrl = productDetailTpl.apply({
                                                 websiteUrl: websiteUrl,
                                                 pageType: pageType,
                                                 pageName: pageName
                                             });*/
                                            var stageBuilderUrl = detailGrid.getJointUrl(stageUrl, pageName, pageType);
                                            builderUrl = detailGrid.getJointUrl(websiteUrl, pageName, pageType);

                                            //判断但是是哪个环境
                                            //现在逻辑，如果发布配置里面有记录websiteConfig，就直接用这个来查发布出来的环境
                                            if (websiteConfig && websiteConfig.checkUrl) {
                                                var controller = Ext.create('CGP.cmslog.controller.Controller');
                                                controller.getTargetStatus(websiteConfig, function (status) {
                                                    if (status == 'TEST') {
                                                        window.open(stageBuilderUrl);
                                                    } else {
                                                        window.open(builderUrl);
                                                    }
                                                });
                                            } else {
                                                //没有就让用户自己选
                                                var win = Ext.create('Ext.window.Window', {
                                                    layout: {
                                                        type: 'vbox',
                                                        align: 'center',
                                                        pack: 'center'
                                                    },
                                                    width: 350,
                                                    height: 200,
                                                    modal: true,
                                                    title: i18n.getKey('目标环境'),
                                                    defaults: {
                                                        margin: '10 25'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'displayfield',
                                                            value: `<a href="#" style="color: blue" onclick="window.open('${stageBuilderUrl}')">stage环境中该产品</a>`
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            value: `<a href="#" style="color: blue" onclick="window.open('${builderUrl}')">release环境中该产品</a>`
                                                        }
                                                    ]
                                                });
                                                win.show();
                                            }
                                        }
                                    });
                                } else {
                                    ela.on("click", function () {
                                        JSShowJsonData(message, i18n.getKey('errorInfo'));
                                    });
                                }
                            }
                        }
                    }
                };
            }
        },
    ],
    features: [{
        ftype: 'grouping',
        collapsible: false,
        groupHeaderTpl: [
            i18n.getKey('status') + ":",
            '{name:this.formatName}',
            {
                formatName: function (status) {
                    return status == 200 ? '成功' : '失败'
                }
            }
        ]
    }],
    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: new Ext.XTemplate(
            '<div><div id="log-{_id}"  style="float:left;width: 100%"></div></div>'
        )
    }],
    store: {
        xtype: 'store',
        fields: [
            'source', 'cmsType', 'status', 'message', 'cmsConfig', '_id', 'cmsDetailLog'
        ],
        groupField: 'status',
        data: []
    },
    /**
     *
     * @param detail 发布详情
     * @param cmslog 发布记录
     */
    diySetValue: function (detail, cmslogData) {
        var me = this;
        me.cmslogData = cmslogData;
        me.resultStatus = cmslogData?.status;
        me.targetEnv = cmslogData?.targetEnv;
        me.stageUrl = cmslogData?.cmsPublishRequestSnapShot?.extraParams?.websiteConfig?.stageUrl || '';
        me.websiteUrl = cmslogData?.cmsPublishRequestSnapShot?.extraParams?.websiteConfig?.websiteUrl || '';
        me.websiteConfig = cmslogData?.cmsPublishRequestSnapShot?.extraParams?.websiteConfig || '';
        me.store.proxy.data = detail;
        me.store.load();
    }
})

Ext.Loader.syncRequire([
    'CGP.main.config.Navigation',
    'CGP.main.config.PageText',
    'CGP.login.view.Login',
    'CGP.main.model.Navigator'])
Ext.define('MainPage', {
    extend: 'Ext.container.Viewport',
    pageText: null,
    route: Ext.create('Ext.ux.Route'),
    params: {
        token: Ext.util.Cookies.get('token'),
        currentUser: ''
    },
    homePage: 'home.htm',
    titleText: null,
    permissionMap: null,//记录导航权限
    initComponent: function () {
        var me = this;
        me.pageText = CGP.main.config.PageText.data;
        me.navigation = CGP.main.config.Navigation.data;
        //获取token
        me.authentication();
        //接口检查权限
        me.checkNavigationPermission(me.navigation);
        if (me.permissionMap) {
            //初始化多语言
            initResource(me.pageText);
            //获取网站状态stage/release
            //JSWebsiteIsStage获取的数据是反的
            getWebsiteMode();
            //获取保存在数据库的网站配置
            JSGetWebsiteConfig('qpson', JSWebsiteIsStage() == true ? 'release' : 'stage');
            Ext.apply(me, {
                layout: {
                    type: 'border'
                },
                items: [me.createHeader(), me.createTabs(), me.createSideBar()]
            });
            me.route.showPageByHash(me.navigation);
            me.callParent();
            me.createGlobalAttr();
        } else {
            me.callParent();
        }
    },
    /**
     * 检查导航权限
     */
    checkNavigationPermission: function (navigation) {
        var me = this;
        var permission = [];
        var navigationArr = [];
        var dealFun = function (arr) {
            for (let i = 0; i < arr.length; i++) {
                //permission现在暂定为全是read的权限
                permission.push(arr[i].permission);
                navigationArr.push(arr[i]._id);
                if (arr[i].items) {
                    arguments.callee(arr[i].items);
                }
            }
        }
        dealFun(navigation);
        JSCheckPermission(permission, function (response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success) {
                var map = {};
                (navigationArr => navigationArr.map(function (item, index, array) {
                    map[item] = responseText.data[index];
                }))(navigationArr);
                me.permissionMap = map;
            }
        }, false);
    },
    createHeader: function () {
        var me = this;
        var user = eval("(" + Ext.util.Cookies.get("user") + ")");

        function createHTML() {

            return '<div style="text-align:right;margin-right:4em;color:#FFF;">' + Ext.util.Cookies.get('currentUser') + '</b></div>';

        }

        me.header = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            id: "mainPage_head",
            region: 'north',
            iconCls: 'icon_qpp',
            title: (top.websiteName) + (!JSWebsiteIsStage() ? ' | ' + '<span class="testSpan">测试网站</span>' : ''),
            height: 38,
            tools: [
                {
                    xtype: 'toolbar',
                    style: 'background-color:rgba(220,38,38,0)',
                    border: false,
                    items: [
                        {
                            labelWidth: 30,
                            labelStyle: 'color:#FFF;',
                            xtype: 'displayfield',
                            value: createHTML(),
                            fieldLabel: me.pageText.greet
                        },
                        {
                            xtype: 'button',
                            text: me.pageText.modifyPassword,
                            baseCls: 'modifyPasswordBtn',
                            handler: function () {
                                me.adminModifyPasswordWin();
                            }
                        },
                        {
                            width: 100,
                            hideLabel: true,
                            xtype: 'displayfield',
                            value: '<div><a href="#" style="margin-left:2em;color:#FFF;">' + me.pageText.exit + '</a><div>',
                            labelSeparator: '',
                            listeners: {
                                'afterrender': function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        Ext.util.Cookies.clear('token', '/');
                                        Ext.util.Cookies.clear('token', '/' + top.pathName);
                                        location.reload();
                                    });
                                }
                            }
                        },
                        {
                            width: 100,
                            hideLabel: true,
                            xtype: 'displayfield',
                            value: '<div><a href="#" style="margin-left:2em;color:#FFF;">相关网站</a><div>',
                            labelSeparator: '',
                            listeners: {
                                'afterrender': function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSOpen({
                                            id: 'linkpage',
                                            url: path + 'partials/tools/links/main.html',
                                            title: i18n.getKey('相关网站链接'),
                                            refresh: true
                                        })
                                    });
                                }
                            }
                        },
                        {
                            labelWidth: 60,
                            xtype: 'combobox',
                            fieldLabel: me.pageText.language,
                            labelAlign: 'left',
                            value: 'zh',
                            readOnly: true,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['country', 'language'],
                                data: [
                                    {
                                        country: '中文（简体）',
                                        language: 'zh'
                                    },
                                    {
                                        country: '中文（繁体）',
                                        language: 'zh_TW'
                                    },
                                    {
                                        country: 'English',
                                        language: 'en'
                                    }
                                ]
                            }),
                            displayField: 'country',
                            valueField: 'language',
                            value: Ext.util.Cookies.get('lang') || 'zh',
                            forceSelection: false,
                            editable: false,
                            mode: 'local',
                            listeners: {
                                'select': function (combo, records, eOpts) {
                                    var targetLang = records[0].get('language');
                                    var targetCountry = records[0].get('country');
                                    Ext.util.Cookies.set('lang', targetLang);
                                    location.reload();
                                }
                            }
                        }
                    ]
                }
            ]
        });
        return me.header;
    },
    createSideBar: function () {
        var me = this;
        me.sidebar = Ext.create('Ext.panel.Panel', {
            id: 'mainPage_navigation',
            collapsible: true,
            autoScroll: true,
            title: me.pageText.navigation,
            region: 'west',
            fill: false,
            layout: {
                type: 'accordion',
                animate: false,
                fill: false
            },
            animCollapse: true,
            split: true,
            collapseDirection: Ext.Component.DIRECTION_LEFT,
            width: '10%',
            minWidth: 230,
            items: me.createSideTree(),
        })
        return me.sidebar;
    },
    createTabs: function () {
        var me = this;
        window.iframeId = 'main';
        me.tabs = Ext.create('Ext.TabPanel', {
            id: 'tabs',
            region: 'center',
            frame: false,
            // deferredRender: false,
            enableTabScroll: true,
            plugins: Ext.create('Ext.ux.TabCloseMenu'),
            items: [me.createWelcomeTab()],
            listeners: {
                tabchange: function (tab, newTab, oldTab) {
                    // 确保新tab内容完全渲染
                    // newTab.doLayout();
                    
                    //指定几个页面，自动收起导航树
                    //发货详情 订单详情
                    var arr = ['sanction', 'orderDetails'];
                    if (Ext.Array.contains(arr, newTab.id)) {
                        Ext.getCmp('mainPage_navigation').collapse();
                    } else {
                        Ext.getCmp('mainPage_navigation').expand();
                    }
                }
            }
        });
        return me.tabs;
    },
    createBottomBar: function () {
        var me = this;
        me.bottomBar = Ext.create('Ext.panel.Panel', {
            id: 'mainPage_bottom',
            title: me.pageText.bottom,
            height: '10%',
            region: 'south'
        })
        return me.bottomBar;
    },
    createSideTree: function () {
        var me = this,
            trees = [];
        var errorInfo = {};
        var buildItems = function (items) {
                var result = items.filter(function (item) {
                    if (me.permissionMap[item._id]) {
                        if (item.items && item.items.length > 0) {
                            item.children = buildItems(item.items);
                        }
                        return true;
                    } else {
                        errorInfo[item._id] = '导航没权限：' + item.text
                        console.log('导航没权限：' + item.text);
                        return false;
                    }
                });
                return result;
            },
            afterDefaultRenderItems = [];

        for (var i = 0; i < me.navigation.length; i++) {
            var id = me.navigation[i]._id;
            //如果有权限,就添加该导航大分类
            if (me.permissionMap[id]) {
                var resultArrItem = me.navigation[i],
                    {text, expanded, items} = resultArrItem,
                    nodeItems = buildItems(items),
                    title = i18n.getKey(text),
                    filterParams = [
                        {
                            name: 'afterDefaultRender',
                            value: true,
                            type: 'boolean'
                        }
                    ],
                    tree = Ext.create('Ext.tree.Panel', {
                        id: 'mainPage_' + i,
                        title: title,
                        animate: true,
                        syncRowHeight: false,
                        hideHeaders: true,
                        collapsed: !expanded,
                        collapsible: true,
                        rootVisible: false,
                        store: {
                            xtype: 'treestore',
                            model: 'CGP.main.model.Navigator',
                            root: {
                                id: me.navigation[i]._id,
                                text: '',
                                expanded: true,
                                children: nodeItems
                            },
                            proxy: 'memory',
                        },
                        columns: [{
                            xtype: 'treecolumn',
                            dataIndex: 'text',
                            sortable: true,
                            flex: 1,
                            renderer: function (value, mate, record, a, b, c, view) {
                                return value;
                            }
                        }],
                        // 在树形面板创建后选择第二个叶子节点
                        listeners: {
                            "itemclick": onTreeItemClick,
                            'afterrender': function (treePanel) {
                                task.delay(150);
                            },
                        }
                    });
                
                afterDefaultRenderItems = Ext.Array.merge(afterDefaultRenderItems, JSRecursiveSearch(resultArrItem, 'items', filterParams));
                //创建延时任务，一段时间内只执行一次
                var task = new Ext.util.DelayedTask(function () {
                    onTreeDefaultItemClick(afterDefaultRenderItems);
                });
                trees.push(tree);
            }
        }
        console.log(errorInfo);
        if (!Ext.Object.isEmpty(errorInfo)) {
            localStorage.setItem('errorInfo:' + Ext.util.Cookies.get('token'), JSON.stringify(errorInfo));
        }
        return trees;
    },
    createWelcomeTab: function () {
        var me = this;
        me.welcomeTab = Ext.create('Ext.panel.Panel', {
            id: 'welcomeTab',
            frame: false,
            title: me.pageText.welcomeTab
        });
        return me.welcomeTab;
    },
    authentication: function () {
        var me = this;
        var loginWindow;
        if (!window.adminPath) {
            getLoginWindow().show();
        }
        var token = Ext.util.Cookies.get('token');
        var params;
        if (Ext.isEmpty(token) || token == null) {
            params = {};
        } else {
            params = {
                access_token: token
            }
        }
        var requestParam = {
            method: 'GET',
            async: true,
            url: adminPath + 'api/me',
            params: params,
            success: function (resp) {

                if (resp.status == 401 || resp.status == 500) {
                    getLoginWindow().show();
                } else {

                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success) {
                        var name = response.data.firstName;
                        if (Ext.isEmpty(name)) {
                            name = response.data.emailAddress;
                        }
                        me.params.currentUser = response.data.firstName;
                    }
                }
            },
            failure: function (resp) {
                console.log(resp);
                if (resp.status == 0 || resp.status == 500 || resp.status == 401) {
                    getLoginWindow().show();
                }
            }
        }
        var r = Ext.Ajax.request(requestParam);

        function getLoginWindow() {
            if (loginWindow)
                return loginWindow;
            loginWindow = new Ext.window.Window({
                closable: false,
                title: me.pageText.loginToCGP,
                layout: 'border',
                width: 320,
                height: 220,
                items: [Ext.create('CGP.login.view.Login', {
                    bodyStyle: ' padding: 10px 10px;',
                    title: '',
                    reLoad: true,
                    region: 'center'
                })]
            });
            return loginWindow;
        }
    },
    autoOpenWindowByHash: function () {
        var hash = window.location.hash;
        if (!hash)
            return;
        hash = hash.substring(1);
        if (hash.charAt(0) === "/")
            hash = hash.substring(1);
        var url = path + "partials/" + hash;
        var tab = JSOpen({
            url: url,
            id: 'route'
        });
        console.log(tab);
        tab.on('render', function () {
            var iframe = window.frames['tabs_iframe_route'].contentDocument;
            console.log(iframe);
            iframe.body.onload = function () {
                console.log('set title');
                iframe = window.frames['tabs_iframe_route'].contentDocument
                tab.setTitle(iframe.title);
            };


        })
    },
    adminModifyPasswordWin: function () {
        var me = this;
        Ext.create('CGP.main.ModifyPassword', {
            controller: me
        }).show();
    },
    /**
     * 修改网站管理员密码
     * @param {Object} data 表单提交的数据
     * @param {CGP.main.ModifyPassword} win 修改密码的窗口
     */
    modifyAdminPassword: function (data, win) {
        if (data['confirmPwd'] != data['newPassword']) {
            win.form.getComponent('confirmPwd').markInvalid('密码输入不一致！');
        } else {
            var loadMask = win.setLoading(true);
            Ext.Ajax.request({
                url: adminPath + 'api/users/password',
                jsonData: {'currentPassword': data['currentPassword'], 'newPassword': data['newPassword']},
                method: 'PUT',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (resp) {
                    loadMask.hide();
                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success == true) {
                        Ext.Msg.alert('提示', '修改成功！', function closeWin() {
                            win.close();
                        });
                    } else {
                        Ext.Msg.alert('提示', '修改失败，错误信息:' + response.data.message);
                    }
                },
                failure: function (resp) {
                    loadMask.hide();
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }
    },
    /**
     * 创建一些全局的属性
     */
    createGlobalAttr: function () {
        //创建一个所有订单状态的store，以便其他页面引用，storeId为allOrderStatus
        var OrderStatuses = Ext.create('CGP.common.store.OrderStatuses');
    }
});

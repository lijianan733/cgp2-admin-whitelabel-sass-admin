Ext.define("CGP.grouppermission.view.permission.Window", {
    extend: 'Ext.window.Window',
    alias: 'permissionwindow',
    mixins: ["Ext.ux.util.ResourceInit"],
    requires: ["CGP.grouppermission.view.permission.Tree", 'CGP.grouppermission.model.PermissionGroup', 'CGP.grouppermission.store.PermissionGroup'],

    record: null,//保存一条角色信息
    controller: null,//权限window的controller
    saveButtonFun: null, //点击save按钮触发的方法
    permissionTree: null,
    groupTree: null,
    resizable: true,

    modal: true,  //掩饰窗体后的一切。
    closeAction: 'destroy',
    maximizable: true,
    width: 550, // document.body.clientWidth/2,
    height: 550, //document.body.clientHeight/1.5,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    groupTreeCfg: null, //权限组树的配置
    permissionCfg: null, //单个权限树的配置

    constructor: function (config) {
        var me = this;
        me.addEvents("save");


        config = config || {};
        me.saveButtonText = config.saveButtonText || i18n.getKey('save');
        me.initConfig(config);

        me.callParent([config]);
    },
    initComponent: function () {
        var me = this;


        me.tbar = [
            {
                xtype: 'buttongroup',
                width: '100%',
                bodyBorder: false,
                columns: 4,
                defaults: {
                    width: 100
                },
                items: [
                    {
                        text: me.saveButtonText, handler: function (button) {
                            var mask = me.setLoading();
                            me.saveButtonFun.call(me.controller);
                            mask.hide();
                        }
                    },
                    {
                        text: i18n.getKey('close'), handler: function (buttion) {
                            me.windowHidden();
                        }
                    },
                    {
                        text: i18n.getKey('expandAll'), handler: function (buttion) {
                            me.checkAll();
                        }
                    },
                    {
                        text: i18n.getKey('collapseAll'), handler: function (buttion) {
                            me.collapseAll();
                        }
                    },
                    {
                        text: i18n.getKey('selectAll'), handler: function (buttion) {
                            me.selectAll();
                        }
                    },
                    {
                        text: i18n.getKey('deselectAll'), handler: function (buttion) {
                            me.deselectAll();
                        }
                    },
                    {
                        text: i18n.getKey('toggleSelect'), handler: function (buttion) {
                            me.toggleSelect();
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
        var extraParams = {};
        if (!Ext.isEmpty(me.record.get("id"))) {
            extraParams = {
                groupPermissionId: me.record.get("id")
            };
        }
        me.permissionCfg = Ext.merge({
            columns: [
                {text: i18n.getKey('permission')}
            ],
            store: Ext.create("CGP.grouppermission.store.Permission", {
                proxy: {
                    extraParams: extraParams,
                    type: 'ajax',
                    url: adminPath + 'api/groupPermissions/all?access_token=' + Ext.util.Cookies.get('token'),
                    reader: 'nestjson'
                },
                url: adminPath + 'api/groupPermissions/all?access_token=' + Ext.util.Cookies.get('token')
            })
        }, me.permissionCfg);
        me.permissionTree = Ext.create("CGP.grouppermission.view.permission.Tree", me.permissionCfg);

        me.groupTreeCfg = Ext.merge({
            columns: [
                {text: i18n.getKey('grouppermission')}
            ],
            store: Ext.create("CGP.grouppermission.store.Permission", {
                proxy: {
                    extraParams: extraParams,
                    type: 'ajax',
                    url: adminPath + 'api/permissions/groupall?access_token=' + Ext.util.Cookies.get('token'),
                    reader: 'nestjson'
                },
                url: adminPath + 'api/permissions/groupall?access_token=' + Ext.util.Cookies.get('token'),
                ////限制选择父权限组时，不能选择其权限组本身
                // 该监听用于store加载完后，找出该条记录的权限组，可选权限组中将之去除
                listeners: {
                    load: function (store, records) {
                        var title = me.record.get('title');
                        if (title) {
                            var rootNode = store.getRootNode();
                            rootNode.findChild('title', title, true).remove()
                        }
                    }
                }
            })
        }, me.groupTreeCfg);
        me.groupTree = Ext.create("CGP.grouppermission.view.permission.Tree", me.groupTreeCfg);

        me.add(me.permissionTree);
        me.add(me.groupTree);
        me.on("show", function (component) {
            component.permissionTree.fireEvent("showfirst", component.permissionTree);
            component.groupTree.fireEvent("showfirst", component.groupTree);
        });

    },
    windowHidden: function () {
        this.close();
    },
    checkAll: function () {
        var me = this;
        me.permissionTree.expandAll();
    },
    collapseAll: function () {
        var me = this;
        me.permissionTree.collapseAll();
    },

    selectAll: function () {
        var me = this;
        me.groupTree.selectAll();
        me.permissionTree.selectAll();
    },
    deselectAll: function () {
        var me = this;
        me.groupTree.deselectAll();
        me.permissionTree.deselectAll();
    },
    toggleSelect: function () {
        var me = this;
        me.groupTree.toggleSelect();
        me.permissionTree.toggleSelect();
    }

});
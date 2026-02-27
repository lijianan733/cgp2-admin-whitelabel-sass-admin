Ext.define('CGP.common.commoncomp.EditForm', {
    extend: 'Ext.container.Container',
    alias: 'widget.edit_form',
    editText: '- Edit',
    outTabsId: 'tabs',//包含该Viewport的iframe的外围tabsId
    returnMainPage: false,//配置是否保存后跳转到管理页，并查询出修改，添加的记录
    readOnly: false,
    config: {
        block: '',
        editSuffix: '_edit',
        viewUrl: 'rest/BlockConfig/GetBlockConfig/',
        cfgUrl: 'rest/ViewConfig/GetConfigs/',
        gridPage: 'index.htm',
        autoLoadBlockCfg: true,
        /*formCfg: {
            itemId: 'form',
            region: 'center',
            autoMode: true,
            *//**
         * isRefreshField
         * 在新建时点击保存按钮后，是否对页面再次刷新,默认为true进行刷新
         * 用于Ext.ux.form.Basic中的changeMode函数中
         * 创建时间2017年4月6号10:30
         *//*
            isRefreshField:true
        },
        tbarCfg: {
            itemId: 'toolbar'
        },*/
        activeBtn: ['create', 'update', 'config', 'copy'],
        //是否开启组件权限检查 使用{Ext.ux.permission.ActionChecker}
        enablePermissionChecker: false
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        config = Ext.merge({
            layout: 'border'
        }, config);
        me.addEvents('afterload');
        me.callParent([config]);
    },
    initComponent: function () {
        var me = this;
        var fucCode = me.config.block.toUpperCase();
        me.config.permissions = {
            create: 'AUTH_' + fucCode + '_CREATE',
            update: 'AUTH_' + fucCode + '_UPDATE'
        };
        me.config.tbarCfg = Ext.merge({
            itemId: 'toolbar',
            defaults: {
                disabled: me.readOnly
            },
            btnCreate: {
                handler: function () {
                    me.form.createNewForm();
                    if (me.outTabsId) {
                        var tabs = top.Ext.getCmp(me.outTabsId);
                        if (tabs) {
                            var editPageId = me.block + '_edit';//管理页面的id
                            var editPage = tabs.getComponent(editPageId);
                            if (editPage) {
                                editPage.setTitle(i18n.getKey('create') + '_' + i18n.getKey(me.i18nblock));
                            }
                        }
                    }
                }
            },
            btnCopy: {
                handler: function () {
                    me.form.copyForm();
                    if (me.outTabsId) {
                        var tabs = top.Ext.getCmp(me.outTabsId);
                        if (tabs) {
                            var editPageId = me.block + '_edit';//管理页面的id
                            var editPage = tabs.getComponent(editPageId);
                            if (editPage) {
                                editPage.setTitle(i18n.getKey('create') + '_' + i18n.getKey(me.i18nblock));
                            }
                        }
                    }
                }
            },
            btnReset: {
                handler: function () {
                    me.form.resetForm();
                }
            },
            btnSave: {
                handler: function () {
                    me.form.submitForm({
                        callback: function (data, operation, success) {
                            if (success) {
                                me.toolbar.buttonCreate.enable();
                                me.toolbar.buttonCopy.enable();
                            }
                        }
                    });
                }
            },
            btnGrid: {
                handler: function () {
                    JSOpen({
                        id: me.block + 'page',
                        url: path + 'partials/' + me.block + '/' + me.gridPage
                    });
                }
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                    JSOpenConfig(me.block);
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        }, me.config.tbarCfg);
        me.toolbar = Ext.create('Ext.ux.toolbar.Edit', me.config.tbarCfg);
        me.config.formCfg = Ext.merge({
            tbar: me.toolbar,
            itemId: 'form',
            fieldDefaults: Ext.merge({
                readOnly: me.readOnly
            }, me.config.formCfg.fieldDefaults),
            region: 'center',
            autoMode: true,
            /**
             * isRefreshField
             * 在新建时点击保存按钮后，是否对页面再次刷新,默认为true进行刷新
             * 用于Ext.ux.form.Basic中的changeMode函数中
             * 创建时间2017年4月6号10:30
             */
            isRefreshField: true,
            cfgProxy: {
                url: path + me.cfgUrl + 'form/' + me.block
            }
        }, me.config.formCfg);
        me.form = Ext.create('Ext.ux.form.Panel', me.config.formCfg);
        me.callParent();
        me.add(me.form);
        if (me.autoLoadBlockCfg === true)
            me.loadBlockCfg();
    },
    loadBlockCfg: function () {
        var me = this;
        if (me.config.accessControl) {
            var ps = me.config.permissions;
            var permissions = [ps.create, ps.create, ps.update];
            buttons = [me.toolbar.buttonCreate, me.toolbar.buttonCopy, me.toolbar.buttonSave];

            var callback = function (resp) {
                var results = eval('(' + resp.responseText + ')').data;
                for (var i = 0; i < permissions.length; i++) {
                    if (!results[i]) {
                        buttons[i].hide();
                    }
                }
            };
            // JSCheckPermission(permissions, callback);
        }

        me.fireEvent('afterload', me, 'ss');
        /**
         * 扫描组件进行权限检查和将没有权限的组件隐藏掉
         */
        if (me.config.enablePermissionChecker) {
            Ext.create('Ext.ux.permission.ActionChecker').checkPermission();
        }
    }
});

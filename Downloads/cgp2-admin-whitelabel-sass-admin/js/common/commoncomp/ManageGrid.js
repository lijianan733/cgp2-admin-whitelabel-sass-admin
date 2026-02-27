/**
 * @Description:
 * @author nan
 * @date 2023/11/29
 */
Ext.define('CGP.common.commoncomp.ManageGrid', {
    extend: 'Ext.container.Container',
    alias: 'widget.manage_grid',
    pageText: {
        'create': 'create',
        'edit': 'edit'
    },
    defaults: {
        split: true
    },
    isReadOnly: false,
    permissionChecker: Ext.create('Ext.ux.permission.ActionChecker'),
    config: {
        block: '',
        editSuffix: '_edit',
        viewUrl: 'rest/BlockConfig/GetBlockConfig/',
        cfgUrl: 'api/viewconfig/',
        editPage: 'edit',
        autoLoadBlockCfg: true,
        //是否开启组件权限检查 使用{Ext.ux.permission.ActionChecker}
        enablePermissionChecker: false
    },
    constructor: function (config) {
        var me = this;
        initResource(me.pageText);
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
            update: 'AUTH_' + fucCode + '_UPDATE',
            remove: 'AUTH_' + fucCode + '_DELETE'
        }


        me.config.filterCfg = Ext.merge({
            cfgProxy: {
                url: path + me.cfgUrl + 'filter/' + me.block
            },
            itemId: 'filter',
            region: 'north',
            collapsible: true,
            searchActionHandler: function () {
                if (me.filter.isValid()) {
                    me.grid.getStore().loadPage(1);
                }
            }, filterParams: me.queryParams()
        }, me.config.filterCfg);

        if (me.config.filterCfg.filterTemplate) {
            me.filter = Ext.create('Ext.ux.filter.CustomFilter', me.config.filterCfg);
        } else {
            me.filter = Ext.create('Ext.ux.filter.Panel', me.config.filterCfg);
        }
        me.config.tbarCfg = Ext.merge({
            xtype: 'uxstandardtoolbar',
            disabledButtons: ['config'],
            itemId: 'toolbar',
            btnExport: {
                disabled: true
            },
            btnImport: {
                disabled: true
            },
            btnRead: {
                handler: function () {
                    me.grid.getStore().loadPage(1);
                }
            },
            btnClear: {
                handler: function () {
                    me.filter.reset();
                }
            },
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: me.block + me.editSuffix,
                        url: path + "partials/" + me.block + "/" + me.editPage,
                        title: me.pageText.create + '_' + me.i18nblock,
                        refresh: true
                    });
                }
            },
            btnDelete: {
                handler: function () {
                    me.grid.destorySelected();
                    me.grid.store.load();
                }
            },
            btnConfig: {
                handler: function () {
                    JSOpenConfig(me.block);
                }
            },
            btnHelp: {
                handler: function () {
                    Ext.Msg.alert(i18n.getKey('prompt'), '在表格中按住Ctrl键即可实现多选');
                }
            }
        }, me.config.tbarCfg);
        if (me.isReadOnly == true) {//禁用新建和删除
            me.config.tbarCfg.btnCreate.disabled = true;
            me.config.tbarCfg.btnDelete.disabled = true;
        }
        me.config.tbarCfg.hiddenButtons = Ext.Array.merge(me.config.tbarCfg.hiddenButtons || [], ['read', 'clear', 'sepQuery']);

        if (me.config.accessControl) {
            var callback = function (resp) {
                var result = eval('(' + resp.responseText + ')').data;
                if (result[0] === false) {
                    me.config.gridCfg.editAction = false;
                }

                if (result[1] === false) {
                    me.config.gridCfg.deleteAction = false;
                }
            }
            JSCheckPermission([me.config.permissions.update, me.config.permissions.remove], callback, false);
        }
        me.config.gridCfg = Ext.merge({
            itemId: 'grid',
            region: 'center',
            cfgProxy: {
                url: path + me.cfgUrl + me.block + '/grid'
            },
            viewConfig: {
                enableTextSelection: true,
                loadMask: false,
                listeners: {
                    refresh: function () {
                        if (me.config.enablePermissionChecker) {
                            me.permissionChecker.checkPermission();
                        }
                    },
                }
            },
            filter: me.filter,
            tbar: me.config.tbarCfg,
            isReadOnly: me.isReadOnly,
            //gird上的編輯按鈕函數
            editActionHandler: function (grid, rowIndex, colIndex) {
                var m = me.grid.getStore().getAt(rowIndex);
                JSOpen({
                    id: me.block + me.editSuffix,
                    url: path + 'partials/' + me.block + '/' + me.editPage + '?id=' + m.get(m.idProperty) + '&isReadOnly=' + me.isReadOnly,
                    title: (me.isReadOnly ? i18n.getKey('check') : me.pageText.edit) + '_' + me.i18nblock + '(' + m.get(m.idProperty) + ')',
                    refresh: true
                });
            },
        }, me.config.gridCfg);
        me.grid = Ext.create('Ext.ux.grid.Panel', me.config.gridCfg);
        me.toolbar = me.grid.toolbar;
        me.callParent();
        me.add(me.filter);
        me.add(me.grid);
        //重新处理遮罩层的显示,使用整个的遮罩，不使用grid里面内置的
        me.loadMask = new Ext.LoadMask({
            target: me,
            msg: '加载中...',
            store: me.grid.store
        });
        me.grid.view.loadMask = me.loadMask;

        if (me.autoLoadBlockCfg === true)
            me.loadBlockCfg();
    },
    loadBlockCfg: function () {
        var me = this;
        if (me.config.accessControl) {
            var ps = me.config.permissions;
            var permissions = [ps.create, ps.remove];
            buttons = [me.toolbar.buttonCreate, me.toolbar.buttonDelete];

            var callback = function (resp) {
                var results = eval('(' + resp.responseText + ')').data;
                for (var i = 0; i < permissions.length; i++) {
                    if (!results[i]) {
                        buttons[i].hide();
                    }
                }
            };
            JSCheckPermission(permissions, callback);
        }

        me.fireEvent('afterload', me);


    },
    needPermissionCheck: function () {
        var me = this;
        var ps = me.config.permissions;
        if (ps && ps instanceof Object && 'create' in ps && 'update' in ps && 'read' in ps && 'remove' in ps)
            return true;
        return false;
    },
    queryParams: function () {
        if (window.location.href.split("?")[1]) {
            var params = window.location.href.split("?")[1];
            var filterParams = Ext.urlDecode(params);
            return filterParams;
        }
    }
})
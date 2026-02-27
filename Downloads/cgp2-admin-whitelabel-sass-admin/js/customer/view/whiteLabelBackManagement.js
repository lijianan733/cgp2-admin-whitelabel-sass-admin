/**
 * 用户界面
 */
Ext.Loader.syncRequire([
    /*    'CGP.authorityeffectrange.store.AuthorityEffectRangeStore',
        'CGP.authorityeffectrange.model.AuthorityEffectRangeModel',*/
    'CGP.customer.model.AccessControl',
    'CGP.common.field.WebsiteCombo',
    'CGP.customer.view.CreateFilterUserAuthInfoComp',
    'CGP.orderdetails.view.details.OrderLineItem',
])

Ext.onReady(function () {
    // 用户的grid数据展示页面
    var store = Ext.create("CGP.customer.store.CustomerStore"),
        // 登录历史controller
        loginHistoryController = Ext.create('CGP.customer.controller.LoginHistory'),
        // 地址薄controller
        addressBookController = Ext.create("CGP.customer.controller.AddressBook"),
        // 角色controller
        roleController = Ext.create("CGP.customer.controller.RoleManager"),
        // 存了所有角色数据的store
        allRoleStore = Ext.create("CGP.customer.store.AllRoleStore", {
            pageSize: 200
        }),
        customerController = Ext.create("CGP.customer.controller.Customer");

    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('customer'),
        block: 'customer',
        enablePermissionChecker: false,
        // 编辑页面
        editPage: 'edit.html',
        tbarCfg: {
            /*      btnExport: {//借用导出按钮，来配置批量配置权限功能,该功能在业务上有问题
             width: 120,
             disabled: false,
             text: i18n.getKey('set') + i18n.getKey('effectRange'),
             handler: function () {
             var recordArray = page.grid.getSelectionModel().getSelection();
             if (recordArray.length == 0) {
             Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('选择需要操作的记录'));
             } else {
             var idArray = [];
             recordArray.forEach(function (item) {
             idArray.push(item.getId());
             });
             roleController.showAccessControllWin(null, idArray);
             }
             }
             },*/
            hiddenButtons: ['clear', 'help', 'export', 'import', 'delete', 'config'],
            disabledButtons: ['clear', 'help', 'export', 'import', 'delete', 'config'],
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: 'whiteLabelPage',
                        url: path + 'partials/customer/edit.html?type=whiteLabel',
                        title: i18n.getKey('创建') + i18n.getKey('userAccount'),
                        refresh: true
                    });
                }
            },
        },
        gridCfg: {
            store: store,
            frame: false,
            deleteAction: false,
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {
                var recordId = record.get('id');

                JSOpen({
                    id: 'whiteLabelPage',
                    url: path + `partials/customer/edit.html?_id=${recordId}&type=whiteLabel`,
                    title: i18n.getKey(`编辑_${i18n.getKey('userAccount')}(${recordId})`),
                    refresh: true
                });
            },
            columnDefaults: {
                autoSizeColumn: true
            },
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    itemId: 'operation',
                    minWidth: 105,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var enable = record.get('enable'),
                            email = record.get('email'),
                            userName = record.get('userName'),
                            btnName,
                            isActive,
                            roles = record.get('roles'),
                            isProductManager = Ext.Array.some(roles, function (item) {
                                return item.id == 25365244;
                            })

                        if (enable) {
                            btnName = i18n.getKey('disable');
                            isActive = false;
                        } else {
                            btnName = i18n.getKey('enable');
                            isActive = true;
                        }

                        return {
                            xtype: 'button',
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            height: 26,
                            ui: 'default-toolbar-small',
                            menu: [
                                {
                                    text: i18n.getKey('查看关联partner'),
                                    handler: function () {
                                        JSOpen({
                                            id: 'partnerpage',
                                            url: path + `partials/partner/main.html` +
                                                `?userName=${userName}`,
                                            refresh: true,
                                            title: i18n.getKey('partner'),
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('checkRole'),
                                    action: "AUTH_CUSTOMER_CHECKROLE",
                                    handler: function () {
                                        roleController.openShowRoleWindow(record);
                                    }
                                },
                                {
                                    text: i18n.getKey('checkLoginHistory'),
                                    handler: function () {
                                        loginHistoryController.openHistoryWindow(record);
                                    }
                                },
                                {
                                    text: i18n.getKey('checkAddressBook'),
                                    handler: function () {
                                        addressBookController.createAddressBooks(record);
                                    }
                                },
                                /*{
                                    text: i18n.getKey('modifyPassword'),
                                    handler: function () {
                                        roleController.showModifyPasswordWin(record);
                                    }
                                },*/
                                {
                                    text: btnName + i18n.getKey('customer'),
                                    handler: function () {
                                        Ext.Msg.confirm('提示', '是否' + btnName + '该用户？', callback);

                                        function callback(id) {
                                            if (id === 'yes') {
                                                record.set('enable', isActive);
                                                record.save();
                                            }
                                        }
                                    }
                                },
                                {
                                    text: i18n.getKey('product') + i18n.getKey('manager'),
                                    hidden: !isProductManager,
                                    handler: function () {
                                        JSOpen({
                                            id: 'userProduct',
                                            url: path + 'partials/customer/productmanage.html?email=' + record.get('email'),// + '&orderNumber=' + value,
                                            title: i18n.getKey('product') + i18n.getKey('manager'),
                                            refresh: true
                                        });
                                    }
                                }
                            ]
                        }
                    }
                },
                /*{
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 100,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },*/
                {
                    xtype: 'gridcolumn',
                    text: i18n.getKey('userAccount'),
                    dataIndex: 'email',
                    sortable: false,
                    minWidth: 200,
                    renderer: function (value, metadata, record) {
                        metadata.style = "font-weight:bold";
                        var userName = record.get('userName');

                        return userName || value;
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('用户登录方式'),
                    dataIndex: 'id',
                    align: 'center',
                    minWidth: 160,
                    getDisplayName: function (value, metadata, record) {
                        return JSCreateHyperLink('查看');
                    },
                    clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                        var id = record.get('id');

                        JSOpen({
                            id: 'loginMethodPage',
                            url: path + `partials/customer/loginMethod.html?type=whiteLabel&id=${id}`,
                            title: i18n.getKey(`查看_登录方式(${id})`),
                            refresh: true
                        });
                    }
                },
                {
                    xtype: 'diy_date_column',
                    text: i18n.getKey('注册日期'),
                    width: 200,
                    dataIndex: 'registerDate',
                    sortable: false,
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: false,
                    width: 80,
                    renderer: function (value, metadata) {
                        if (value == "MEMBER") {
                            return i18n.getKey('member');
                        } else if (value == "ADMIN") {
                            return i18n.getKey('admin');
                        }
                        return value;
                    }
                },
                {
                    text: i18n.getKey('role'),
                    dataIndex: 'roles',
                    xtype: 'arraycolumn',
                    itemId: 'role',
                    sortable: false,
                    minWidth: 150,
                    lineNumber: 2,
                    valueField: 'name',
                    renderer: function (value, metadata) {
                        metadata.style = 'font-weight:bold';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('firstName'),
                    dataIndex: 'firstName',
                    xtype: 'gridcolumn',
                    itemId: 'firstName',
                    sortable: false,
                    minWidth: 100
                },
                {
                    text: i18n.getKey('lastName'),
                    dataIndex: 'lastName',
                    xtype: 'gridcolumn',
                    itemId: 'lastName',
                    sortable: false,
                    minWidth: 100
                },
                {
                    text: i18n.getKey('dob'),
                    dataIndex: 'dob',
                    // renderer: Ext.util.Format.dateRenderer(system.config.dateFormat),
                    itemId: 'dob',
                    sortable: true,
                    width: 130,
                    renderer: function (value, metadata) {
                        metadata.style = "color: gray";

                        var dateFormat = system.config.dateFormat;
                        return +value ? Ext.Date.format(value, dateFormat) : '';
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: i18n.getKey('gender'),
                    dataIndex: 'gender',
                    itemId: 'gender',
                    sortable: false,
                    width: 80,
                    renderer: function (value) {
                        var typeGather = {
                            M: '男',
                            F: '女',
                            N: '其他',
                        }
                        return typeGather[value || 'N'];
                    }
                },
                {
                    text: i18n.getKey('isActivation'),
                    dataIndex: 'enable',
                    xtype: 'gridcolumn',
                    itemId: 'enable',
                    sortable: false,
                    width: 90,
                    renderer: function (value, metadata) {
                        if (value) {
                            return JSCreateFont('green', true, i18n.getKey('yes'));
                        } else {
                            return JSCreateFont('red', true, i18n.getKey('no'));
                        }
                    }
                },
                {
                    text: i18n.getKey('source'),
                    dataIndex: 'source',
                    xtype: 'gridcolumn',
                    itemId: 'source',
                    sortable: false,
                    minWidth: 80,
                    flex: 1
                },
            ]
        },
        // 查询输入框
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'firstNameSearchField',
                    name: 'firstName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('firstName'),
                    itemId: 'firstName'
                },
                {
                    id: 'lastNameSearchField',
                    name: 'lastName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('lastName'),
                    itemId: 'lastName'
                },
                {
                    id: 'typeSearchField',
                    name: 'type',
                    xtype: 'combo',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: i18n.getKey('admin'), value: 'ADMIN'
                            },
                            {
                                type: i18n.getKey('member'), value: 'MEMBER'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    id: 'genderSearchField',
                    name: 'gender',
                    xtype: 'combo',
                    editable: false,
                    forceSelection: true,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['gender', 'desc'],
                        data: [
                            {
                                gender: 'M',
                                desc: i18n.getKey('male')
                            },
                            {
                                gender: 'F',
                                desc: i18n.getKey('female')
                            },
                            {
                                gender: 'N',
                                desc: i18n.getKey('其他')
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('gender'),
                    itemId: 'gender',
                    displayField: 'desc',
                    valueField: 'gender',
                    queryMode: 'local'
                },
                {
                    xtype: 'textfield',
                    id: 'emailSearchField',
                    name: 'userName',
                    itemId: 'userName',
                    fieldLabel: i18n.getKey('userAccount'),
                },
                {
                    xtype: 'combo',
                    id: 'enableSearchField',
                    name: 'enable',
                    fieldLabel: i18n.getKey('isActivation'),
                    editable: false,
                    haveReset: true,
                    itemId: 'enable',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['enable', 'viewvalue'],
                        data: [
                            {
                                enable: 1,
                                viewvalue: i18n.getKey('yes')
                            },
                            {
                                enable: 0,
                                viewvalue: i18n.getKey('no')
                            }
                        ]
                    }),
                    displayField: 'viewvalue',
                    valueField: 'enable',
                    queryMode: 'local'
                },
                {
                    id: 'roleSearchField',
                    name: 'role',
                    xtype: 'combo',
                    itemId: 'roleCombo',
                    fieldLabel: i18n.getKey('roleName'),
                    editable: false,
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    labelAlign: 'right',
                    store: allRoleStore,
                    queryMode: 'remote',
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                this.insert(0, {
                                    id: null,
                                    name: i18n.getKey('allRole')
                                });
                                combo.select(store.getAt(0));
                            });
                        }
                    }
                },
                {
                    xtype: 'websitecombo',
                    itemId: 'websiteCombo',
                    name: 'website',
                    hidden: true,
                    store: Ext.create('CGP.common.store.AllWebsite', {
                        autoLoad: true
                    }),
                    listeners: {
                        afterrender: function (comp) {
                            setTimeout(() => {
                                comp.setValue(11)
                            }, 2000)

                        }
                    }
                },
                {
                    xtype: 'datefield',
                    id: 'datePurchasedSearch',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'registerDate',
                    itemId: 'registerDate',
                    scope: true,
                    fieldLabel: i18n.getKey('注册日期'),
                    width: 360,
                    format: 'Y/m/d'
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('正式用户'),
                    editable: false,
                    haveReset: true,
                    id: 'isTemp',
                    name: 'isTemp',
                    itemId: 'isTemp',
                    value: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['displayValue', 'value'],
                        data: [
                            {
                                displayValue: '是',
                                value: false
                            },
                            {
                                displayValue: '否',
                                value: true
                            }
                        ]
                    }),
                    displayField: 'displayValue',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    xtype: 'user_auth_info',
                    isFilterComp: true,
                    layout: 'hbox',
                    itemId: 'userAuthInfos',
                    width: 450,
                },
            ]
        }
    });

});

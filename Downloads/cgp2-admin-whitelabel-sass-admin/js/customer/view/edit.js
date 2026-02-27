Ext.onReady(function () {
    var winRole, //声明 添加角色的window
        array = [], //编辑角色时保存角色 数组。形式是 [object,object]
        id = JSGetQueryString('_id'),
        type = JSGetQueryString('type'),
        isWhiteLabelPage = type === 'whiteLabel',
        filterParams = isWhiteLabelPage ? [] : [{"name": "excludeIds", "type": "number", "value": "[11,12]"}],
        websiteStore = Ext.create('CGP.common.store.AllWebsite', {
            autoLoad: true,
            params: {
                filter: Ext.JSON.encode(filterParams)
            }
        }),
        editController = Ext.create("CGP.customer.controller.EditController"),
        isEdit = !!id,
        page = Ext.widget({
            xtype: 'uxeditpage',
            block: 'customer',
            gridPage: 'customer.html',
            tbarCfg: {
                hiddenButtons: ['config', 'help', 'export', 'import', 'copy', 'create'],
                btnReset: {
                    text: i18n.getKey('刷新'),
                    handler: function () {
                        location.reload();
                    }
                },
                btnSave: {
                    text: i18n.getKey('保存'),
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt,
                            userAccountNumberInfo = form.getComponent('userAccountNumberInfo'),
                            emailInfo = form.getComponent('emailInfo'),
                            userAccountNumberInfoValue = userAccountNumberInfo.diyGetValue(),
                            emailInfoValue = emailInfo.diyGetValue(),
                            newEmailInfoValue = isEdit ? {} : emailInfoValue,
                            // suffixUrl = isEdit ? `api/users/${id}` : 'api/users',
                            url = adminPath + 'api/users',
                            result = Ext.Object.merge(userAccountNumberInfoValue, newEmailInfoValue);

                        if (form.isValid()) {
                            JSCreateOrEditPageRefresh(url, result, '_id', id, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText),
                                        data = responseText?.data;

                                    console.log(data)
                                }
                            })
                        }
                    }
                },
                btnGrid: {
                    handler: function (btn) {
                        var pageTypeGather = {
                                true: {
                                    htmlFileName: 'whitelabel',
                                    title: 'userAccount',
                                    id: 'whitelabelpage'
                                },
                                false: {
                                    htmlFileName: 'customer',
                                    title: '后台管理用户账号',
                                    id: 'customerpage'
                                }
                            },
                            {htmlFileName, title, id} = pageTypeGather[isWhiteLabelPage];

                        JSOpen({
                            id: id,
                            url: path + `partials/customer/${htmlFileName}.html`,
                            title: i18n.getKey(title),
                            refresh: true
                        });
                    }
                }
            },
            formCfg: {
                model: 'CGP.customer.model.Customer',
                remoteCfg: false,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'uxfieldcontainer',
                        labelAlign: 'top',
                        name: 'userAccountNumberInfo',
                        itemId: 'userAccountNumberInfo',
                        fieldLabel: JSCreateFont('#000', true, i18n.getKey('用户账号信息'), 18),
                        width: '100%',
                        margin: '0 0 10 20',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            labelWidth: 120,
                            margin: '10 0 0 0',
                        },
                        diySetValue: function (data) {
                            var me = this,
                                items = me.items.items;

                            items.forEach(item => {
                                var {name} = item;

                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                            })
                        },
                        diyGetValue: function () {
                            var me = this,
                                result = {},
                                items = me.items.items;

                            items.forEach(item => {
                                var {name, disabled} = item;

                                if (!disabled) {
                                    result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                                }
                            })
                            return result;
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'id',
                                itemId: 'id',
                                // allowBlank: false,
                                hidden: true,
                                fieldLabel: i18n.getKey('id'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'email',
                                itemId: 'email',
                                // allowBlank: false,
                                hidden: true,
                                fieldLabel: i18n.getKey('email'),
                            },
                            {
                                xtype: 'combo',
                                name: 'type',
                                editable: false,
                                itemId: 'type',
                                margin: '20 0 0 0',
                                matchFieldWidth: true,
                                fieldLabel: i18n.getKey('type'),
                                triggerAction: 'all',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ["custType", "value"],
                                    data: [{
                                        custType: i18n.getKey('admin'), value: 'ADMIN'
                                    }, {
                                        custType: i18n.getKey('member'), value: 'MEMBER'
                                    }]
                                }),
                                displayField: 'custType',
                                valueField: 'value',
                                queryMode: 'local',
                                forceSelection: true,
                                typeAheand: true,
                                allowBlank: false
                            },
                            {
                                name: 'gender',
                                fieldLabel: i18n.getKey('gender'),
                                itemId: 'gender',
                                margin: '20 0 0 0',
                                allowBlank: false,
                                editable: false,
                                xtype: 'combo',
                                matchFieldWidth: true,
                                triggerAction: 'all',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ["gender", 'viewvalue'],
                                    data: [
                                        {
                                            gender: 'M',
                                            viewvalue: i18n.getKey('male')
                                        },
                                        {
                                            gender: 'F',
                                            viewvalue: i18n.getKey('female')
                                        },
                                        {
                                            gender: 'N',
                                            viewvalue: i18n.getKey('其他')
                                        }
                                    ]
                                }),
                                displayField: 'viewvalue',
                                valueField: 'gender',
                                queryMode: 'local',
                                forceSelection: true,
                                typeAheand: true
                            },
                            {
                                name: 'firstName',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('firstName'),
                                itemId: 'firstName'
                            },
                            {
                                name: 'lastName',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('lastName'),
                                itemId: 'lastName'
                            },

                            {
                                xtype: 'textfield',
                                name: 'userName',
                                itemId: 'userName',
                                // allowBlank: false,
                                hidden: !isWhiteLabelPage,
                                // disabled: !isWhiteLabelPage,
                                readOnly: isEdit,
                                fieldStyle: isEdit ? 'background-color: silver' : '',
                                fieldLabel: i18n.getKey('userAccount'),
                            },
                            /*{
                                xtype: 'textfield',
                                name: 'email',
                                itemId: 'email',
                                hidden: !isWhiteLabelPage,
                                fieldLabel: i18n.getKey('userAccount'),
                            },*/
                            {
                                xtype: 'datefield',
                                fieldLabel: i18n.getKey('dob'),
                                name: 'dob',
                                itemId: 'dob',
                                format: 'Y-m-d',
                                submitFormat: 'u',
                                editable: false,
                                diySetValue: function (data) {
                                    var me = this;
                                    if (data) {
                                        me.setValue(new Date(data));
                                    }
                                },
                                diyGetValue: function () {
                                    var me = this,
                                        value = me.getValue();

                                    return new Date(value).getTime();
                                },
                                listeners: {
                                    afterrender: function (comp) {
                                        !isEdit && comp.setValue(new Date())
                                    }
                                }
                            },
                            {
                                name: 'enable',
                                fieldLabel: i18n.getKey('isActivation'),
                                itemId: 'enable',
                                xtype: 'combo',
                                editable: false,
                                colspan: 2,
                                matchFieldWidth: true,
                                triggerAction: 'all',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['enable', 'viewvalue'],
                                    data: [{
                                        enable: true,
                                        viewvalue: i18n.getKey('yes')
                                    }, {
                                        enable: false,
                                        viewvalue: i18n.getKey('no')
                                    }]
                                }),
                                displayField: 'viewvalue',
                                valueField: 'enable',
                                queryMode: 'local',
                                forceSelection: true,
                                typeAheand: true
                            },
                            {
                                xtype: 'gridcombo',
                                itemId: 'websiteCombo',
                                fieldLabel: i18n.getKey('website'),
                                editable: false,
                                allowBlank: false,
                                multiSelect: false,
                                colspan: 2,
                                name: 'website',
                                displayField: 'name',
                                valueField: 'id',
                                store: websiteStore,
                                matchFieldWidth: true,
                                pickerAlign: 'bl',
                                diyGetValue: function () {
                                    var me = this;

                                    return me.getArrayValue();
                                },
                                gridCfg: {
                                    store: websiteStore,
                                    hideHeaders: true,
                                    height: 300,
                                    columns: [{
                                        text: i18n.getKey('name'),
                                        width: '100%',
                                        dataIndex: 'name'
                                    }],
                                    bbar: Ext.create('Ext.PagingToolbar', {
                                        store: websiteStore,
                                        displayInfo: true,
                                        displayMsg: '',
                                        emptyMsg: i18n.getKey('noData')
                                    })

                                },
                                listeners: {
                                    afterrender: function (comp) {
                                        var result = isWhiteLabelPage ? [11] : [5]

                                        comp.setValue(result);
                                        comp.setInitialKeyValues('id', result);
                                        
                                        // 因为要让其先渲染赋值 再隐藏  直接隐藏不触发渲染回调
                                        comp.setVisible(!isWhiteLabelPage);
                                    }
                                }
                            },
                            {
                                xtype: 'gridfield',
                                itemId: 'roles',
                                name: 'roles',
                                colspan: 2,
                                fieldLabel: i18n.getKey('role'),
                                labelAlign: 'right',
                                width: 500,
                                gridConfig: {
                                    height: 300,
                                    tbar: [
                                        {
                                            xtype: 'button', text: i18n.getKey('setRole'),
                                            handler: function (btn) {
                                                var userAccountNumberInfo = page.form.getComponent('userAccountNumberInfo'),
                                                    roleField = userAccountNumberInfo.getComponent('roles');

                                                editController.openModifyRoleWindow(roleField);
                                            }
                                        }
                                    ],
                                    store: Ext.create("Ext.data.Store", {
                                        model: 'CGP.customer.model.Role',
                                        storeId: 'localRoleStore',
                                        proxy: {
                                            type: 'pagingmemory'
                                        },
                                        data: []
                                    }),//localRoleStore,
                                    columns: [
                                        {
                                            text: i18n.getKey('name'),
                                            width: 126,
                                            sortable: false,
                                            dataIndex: 'name'
                                        },
                                        {
                                            text: i18n.getKey('description'),
                                            sortable: false,
                                            flex: 1,
                                            dataIndex: 'description'
                                        }
                                    ]
                                },
                                diySetValue: function (data) {
                                    var me = this,
                                        store = me.gridConfig.store;

                                    console.log(data)
                                    store.proxy.data = data || [];
                                    store.load();
                                },
                                diyGetValue: function () {
                                    var me = this,
                                        store = me.gridConfig.store,
                                        data = store.proxy.data,
                                        result = data.map(item => {
                                            return item['data'] || item
                                        })

                                    return result;
                                }
                            },
                        ]
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        labelAlign: 'top',
                        name: 'emailInfo',
                        itemId: 'emailInfo',
                        fieldLabel: JSCreateFont('#000', true, i18n.getKey('邮箱登录'), 18),
                        width: '100%',
                        margin: '50 0 10 20',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            labelWidth: 120,
                            margin: '10 0 0 0',
                        },
                        hidden: isEdit,
                        disabled: isEdit,
                        diyGetValue: function () {
                            var me = this,
                                result = {},
                                items = me.items.items;

                            items.forEach(item => {
                                var {name} = item;

                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            })
                            return result;
                        },
                        items: [
                            {
                                name: 'email',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('email'),
                                itemId: 'email',
                                //vtype: 'email',
                                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                                regexText: i18n.getKey('Please enter the correct email!'),
                                allowBlank: false
                            },
                            {
                                xtype: 'container',
                                width: 500,
                                layout: 'hbox',
                                name: 'password',
                                itemId: 'password',
                                diyGetValue: function () {
                                    var me = this,
                                        password = me.getComponent('password');

                                    return password.getValue();
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('password'),
                                        name: 'password',
                                        itemId: 'password',
                                        inputType: 'password',
                                        minLength: 6,
                                        maxLength: 18,
                                        regex: /^[\dA-Za-z(!@#$%&)]{6,15}$/,
                                        regexText: 'Password length must be between 6 to 15',
                                        allowBlank: false,
                                        listeners: {
                                            afterrender: function (field) {
                                                // 创建切换按钮
                                                var button = Ext.create('Ext.button.Button', {
                                                    text: '🔒',
                                                    width: 30,
                                                    height: 25,
                                                    style: 'position: absolute; right: 5px; top: 2px;',
                                                    componentCls: "btnOnlyIcon",
                                                    handler: function (btn) {
                                                        var inputEl = field.inputEl,
                                                            currentType = inputEl.dom.type,
                                                            newType = currentType === 'password' ? 'text' : 'password',
                                                            text = JSCreateFont('#000', true, i18n.getKey('👁'), 18);

                                                        // 直接修改DOM属性
                                                        inputEl.dom.type = newType;

                                                        // 更新按钮文本
                                                        btn.setText(newType === 'password' ? '🔒' : text);
                                                    }
                                                });

                                                // 将按钮添加到字段容器中
                                                field.up().add(button);
                                            }
                                        }
                                    },
                                ]
                            },
                        ]
                    }
                ],
                listeners: {
                    editing: function () {

                        if (page != null) {
                            var form = page.form,
                                userAccountNumberInfo = form.getComponent('userAccountNumberInfo'),
                                websiteCombo = userAccountNumberInfo.getComponent('websiteCombo');

                            if (page.form.getCurrentMode() === 'editing') {
                                websiteCombo.setEditable(false);
                                websiteCombo.readOnly = true;

                            } else if (page.form.getCurrentMode() === 'creating') {
                                websiteCombo.setEditable(true);
                                websiteCombo.readOnly = false;
                            }
                        }
                    },
                    afterrender: function (comp) {
                        if (isEdit) {
                            var url = adminPath + `api/users/${id}`,
                                queryData = JSGetQuery(url),
                                userAccountNumberInfo = comp.getComponent('userAccountNumberInfo');

                            console.log(queryData)
                            userAccountNumberInfo.diySetValue(queryData);
                        }
                    }
                }
            },
            listeners: {
                afterload: function (p) {
                    var form = p.form,
                        userAccountNumberInfo = form.getComponent('userAccountNumberInfo'),
                        websiteCombo = userAccountNumberInfo.getComponent('websiteCombo');

                    if (form.getCurrentMode() === 'editing') {
                        websiteCombo.setEditable(false);
                        websiteCombo.readOnly = true;
                    }
                }
            }
        });
});

/**
 * Created by nan on 2018/8/10.
 */
Ext.syncRequire([
    'CGP.resourcesoperation.model.ResourcesOperationModel',
    'CGP.resourcesoperation.store.ResourcesOperationStore'
]);
Ext.onReady(function () {
    var store = Ext.create('CGP.resourcesoperation.store.ResourcesOperationStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('recoursesOperation'),
        block: 'recoursesOperation',
        editPage: 'edit.html',
        //权限控制
        tbarCfg: {
            hiddenButtons: [],//按钮的名称
            disabledButtons: ['create', 'delete', 'config']//按钮的名称
        },
        gridCfg: {
            store: store,
            frame: false,
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            columnDefaults: {
                width: 200
            },
            selType: 'rowmodel',
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name')
                },
                {
                    dataIndex: 'code',
                    text: i18n.getKey('code')
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description')
                }
            ]
        },
        // 搜索框
        filterCfg: {
            hidden: true,
            items: []
        }
    });
});

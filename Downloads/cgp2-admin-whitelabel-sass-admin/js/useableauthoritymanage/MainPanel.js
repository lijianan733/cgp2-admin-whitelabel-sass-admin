/**
 * Created by nan on 2018/8/28.
 */
Ext.syncRequire([
    'CGP.useableauthoritymanage.view.LeftPanel',
    'CGP.useableauthoritymanage.view.RightPanel'
])
Ext.onReady(function () {
    var permissionId = JSGetQueryString('id');
    Ext.create('Ext.container.Viewport', {
        title: i18n.getKey('permission'),
        layout: 'border',
        items: [
            {
                xtype: 'rightpanel',
                title: '权限-tree视图'
            },
            {
                xtype: 'leftpanel',
                region: 'east',
                title: '权限-grid视图',
                width: '100%',
                permissionId: permissionId,
                collapseMode: 'mini',//bug,只能写在配置中，无法传入一个实例化的对象
                collapsible: true

            }
        ]
    })
});
/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.model.CreateQueryPartnerWindowModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
        },
        {
            name: 'email',
            type: 'string',
        },
        {
            name: 'platform',
            type: 'string',
        },
        {
            name: 'createdDate',
            type: 'number',
        },
        {
            name: 'name',
            type: 'string',
        }
    ],
})
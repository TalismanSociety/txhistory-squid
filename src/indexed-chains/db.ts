import { createOrmConfig } from '@subsquid/typeorm-config'
import { DataSource, EntityManager } from 'typeorm'

export const getStandaloneDbConnection = async (): Promise<EntityManager> => {
  const dataSourceOptions = createOrmConfig()
  const dataSource = new DataSource(dataSourceOptions)
  await dataSource.initialize()

  return new EntityManager(dataSource)
}

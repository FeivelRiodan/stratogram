import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

class tz {
  public refs = schema.refs({
    allowedDate: DateTime.local().minus({ days: 2 })
  })

  public schema = schema.create({
    checkin_date: schema.date({}, [
      rules.before(this.refs.allowedDate)
    
    ])
  })
}

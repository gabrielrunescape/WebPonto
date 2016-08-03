json.extract! registro, :id, :nome, :login, :senha, :data, :created_at, :updated_at
json.url registro_url(registro, format: :json)
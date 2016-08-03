class CreateRegistros < ActiveRecord::Migration[5.0]
  def change
    create_table :registros do |t|
      t.string :nome
      t.string :login
      t.string :senha
      t.date :data

      t.timestamps
    end
  end
end

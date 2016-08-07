class Usuario < ApplicationRecord
  #EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  validates :login, :presence => true, :uniqueness => true, :length => { :in => 4..16 }
  #validates :email, :presence => true, :uniqueness => true, :format => EMAIL_REGEX
  validates :senha, :confirmation => true #password_confirmation attr
  validates_length_of :senha, :in => 6..20, :on => :create
end

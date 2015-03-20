#!/usr/bin/env ruby

def mac?
  /darwin/i === RUBY_PLATFORM
end

def linux?
  /linux/i === RUBY_PLATFORM
end

module Tty extend self
  def blue; bold 34; end
  def white; bold 39; end
  def red; underline 31; end
  def reset; escape 0; end
  def bold n; escape "1;#{n}" end
  def underline n; escape "4;#{n}" end
  def escape n; "\033[#{n}m" if STDOUT.tty? end
end

class Array
  def shell_s
    cp = dup
    first = cp.shift
    cp.map{ |arg| arg.gsub " ", "\\ " }.unshift(first) * " "
  end
end

def ohai *args
  puts "#{Tty.blue}==>#{Tty.white} #{args.shell_s}#{Tty.reset}"
end

def warn warning
  puts "#{Tty.red}Warning#{Tty.reset}: #{warning.chomp}"
end

def system *args
  abort "Failed during: #{args.shell_s}" unless Kernel.system(*args)
end

def sudo *args
  ohai "/usr/bin/sudo", *args
  system "/usr/bin/sudo", *args
end

def getc  # NOTE only tested on OS X
  system "/bin/stty raw -echo"
  if STDIN.respond_to?(:getbyte)
    STDIN.getbyte
  else
    STDIN.getc
  end
ensure
  system "/bin/stty -raw echo"
end

def wait_for_user
  puts
  puts "I understand, I want to install ethereum (y/n)"
  c = getc
  abort unless c == 89 or c == 121
end

puts
ohai "Before installing ethereum read this:"
puts "Frontier is a curated #{Tty.red}testnet#{Tty.reset}, it is not the 'main release' of Ethereum, but rather an #{Tty.red}initial beta prerelease#{Tty.reset}"
puts "We fully expect #{Tty.red}instability and consensus flaws#{Tty.reset} in the client, some of which may be exploitable"
puts "As curators, we fully reserve the right to ignore blocks at our discretion"
puts "As curators, from a final block that we solely determine, we will preserve all non-contract (i.e. code-less) account balances above the value of 1 ETH into the Homestead Genesis block"

wait_for_user if STDIN.tty?

puts
ohai "Installing ethereum"
puts "Detecting os..."
puts RUBY_PLATFORM
puts

if linux?
	puts "Installing common"
	sudo "apt-get", "install", "-y", "software-properties-common"

	puts "Adding ethereum repositories"
	sudo "add-apt-repository", "-y", "ppa:ethereum/ethereum-qt"
	sudo "add-apt-repository", "-y", "ppa:ethereum/ethereum"
	sudo "add-apt-repository", "-y", "ppa:ethereum/ethereum-dev"

	puts "Updating repository"
	sudo "apt-get", "update"

	puts "Installing ethereum"
	sudo "apt-get", "install", "-y", "ethereum"
elsif mac?
	abort <<-EOABORT if Dir["/usr/local/.git/*"].empty?
#{Tty.red}==> Error:#{Tty.reset}
In order to install ethereum you need Homebrew.
To install Homebrew run the following command:
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
EOABORT
	puts "Found brew"

	puts
	puts "Adding ethereum repository"
	sudo "brew", "tap", "ethereum/ethereum"

	puts "Installing ethereum"
	sudo "brew", "install", "ethereum"
else
	warn "OS not supported."
	puts "For more information please visit http://frontier.ethdev.com/"
	abort
end